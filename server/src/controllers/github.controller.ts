import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { GitHubConnection } from '../models/GitHubConnection';
import { Project } from '../models/Project';

// POST /api/github/connect - Connect public GitHub username
export const connectGitHubUsername = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      res.status(400).json({ message: 'GitHub username is required.' });
      return;
    }

    // Verify username exists on GitHub REST API
    const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`, {
      headers: { 'User-Agent': 'Promptfolio-AI-OS' },
    });

    if (!ghRes.ok) {
      res.status(404).json({ message: `GitHub user "${username}" not found.` });
      return;
    }

    const ghUser = (await ghRes.json()) as any;

    const connection = await GitHubConnection.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          username: ghUser.login,
          avatarUrl: ghUser.avatar_url || '',
          profileUrl: ghUser.html_url || `https://github.com/${ghUser.login}`,
          publicRepos: ghUser.public_repos || 0,
          lastSyncedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'GitHub connected successfully', connection });
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect GitHub account.', error: (error as Error).message });
  }
};

// GET /api/github/repos - Fetch public repositories for connected user or query param
export const fetchRepositories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let username = req.query.username as string;

    if (!username) {
      const connection = await GitHubConnection.findOne({ userId: req.userId });
      if (!connection) {
        res.status(400).json({ message: 'No GitHub username connected. Please connect one first or pass ?username=' });
        return;
      }
      username = connection.username;
    }

    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`, {
      headers: { 'User-Agent': 'Promptfolio-AI-OS' },
    });

    if (!reposRes.ok) {
      res.status(reposRes.status).json({ message: `Failed to fetch repositories for ${username}.` });
      return;
    }

    const reposData = (await reposRes.json()) as any[];
    const repos = reposData.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || 'Code',
      topics: repo.topics || [],
      defaultBranch: repo.default_branch || 'main',
    }));

    res.status(200).json({ username, repos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching repositories.', error: (error as Error).message });
  }
};

// GET /api/github/readme?username=foo&repo=bar&branch=main - Fetch repo README
export const fetchRepoReadme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, repo, branch = 'main' } = req.query;
    if (!username || !repo) {
      res.status(400).json({ message: 'Username and repo parameters are required.' });
      return;
    }

    const readmeRes = await fetch(`https://raw.githubusercontent.com/${encodeURIComponent(username as string)}/${encodeURIComponent(repo as string)}/${encodeURIComponent(branch as string)}/README.md`, {
      headers: { 'User-Agent': 'Promptfolio-AI-OS' },
    });

    if (!readmeRes.ok) {
      res.status(200).json({ readme: 'No public README file found for this repository.' });
      return;
    }

    const readmeText = await readmeRes.text();
    res.status(200).json({ readme: readmeText });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch README content.', error: (error as Error).message });
  }
};

// POST /api/github/import - Import repo directly into user portfolio projects
export const importRepoToProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, htmlUrl, stars, forks, topics, language, readme } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Repository name is required.' });
      return;
    }

    // Check if project already exists with same githubUrl
    const existing = await Project.findOne({ userId: req.userId, githubUrl: htmlUrl });
    if (existing) {
      res.status(409).json({ message: 'This repository has already been imported into your projects.' });
      return;
    }

    const technologies: string[] = [];
    if (language && language !== 'Code') technologies.push(language);
    if (Array.isArray(topics)) {
      topics.forEach(t => {
        if (!technologies.includes(t)) technologies.push(t);
      });
    }

    const project = await Project.create({
      userId: req.userId,
      title: name,
      description: description || `Open-source project ${name}`,
      githubUrl: htmlUrl || '',
      liveUrl: '',
      technologies,
      featured: (stars || 0) > 10,
      source: 'github',
      stars: stars || 0,
      forks: forks || 0,
      topics: topics || [],
      readme: readme || '',
    });

    res.status(201).json({ message: `Repository "${name}" imported to your portfolio projects!`, project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to import repository to projects.', error: (error as Error).message });
  }
};
