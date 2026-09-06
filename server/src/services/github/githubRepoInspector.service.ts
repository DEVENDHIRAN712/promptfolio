export interface RepoEvidence {
  isGitHubRepo: boolean;
  owner?: string;
  repoName?: string;
  description?: string;
  language?: string;
  topics?: string[];
  stars?: number;
  forks?: number;
  defaultBranch?: string;
  detectedProjectType?: string;
  dependencies?: string[];
  devDependencies?: string[];
  npmScripts?: Record<string, string>;
  rootFiles?: string[];
  existingReadme?: string;
  evidenceMessage: string;
}

/**
 * Extract GitHub owner and repository name from a GitHub URL or string
 */
export const parseGitHubUrl = (urlOrName: string): { owner?: string; repo?: string } | null => {
  if (!urlOrName || typeof urlOrName !== 'string') return null;

  const trimmed = urlOrName.trim();

  // Match https://github.com/owner/repo or github.com/owner/repo
  const urlMatch = trimmed.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/i, '') };
  }

  // Match owner/repo string format
  const slashMatch = trimmed.match(/^([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2] };
  }

  return null;
};

/**
 * Detect project framework/type based strictly on manifest files and dependencies
 */
export const detectProjectType = (
  rootFiles: string[],
  deps: string[] = [],
  devDeps: string[] = [],
  language: string = ''
): string => {
  const allDeps = [...deps, ...devDeps].map(d => d.toLowerCase());
  const files = rootFiles.map(f => f.toLowerCase());

  if (allDeps.includes('next')) return 'Next.js Web Application';
  if (allDeps.includes('vite') && (allDeps.includes('react') || allDeps.includes('react-dom'))) return 'React (Vite) Single Page Application';
  if (allDeps.includes('react-scripts')) return 'React (Create React App) Web Application';
  if (allDeps.includes('express') && (allDeps.includes('react') || allDeps.includes('vue'))) return 'MERN / Full-Stack Web Application';
  if (allDeps.includes('express')) return 'Node.js / Express REST API';
  if (allDeps.includes('@nestjs/core')) return 'NestJS Backend Application';
  if (allDeps.includes('vue')) return 'Vue.js Web Application';
  if (allDeps.includes('@angular/core')) return 'Angular Web Application';

  if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
    if (allDeps.includes('django')) return 'Python (Django) Web Framework';
    if (allDeps.includes('flask')) return 'Python (Flask) Web Service';
    if (allDeps.includes('fastapi')) return 'Python (FastAPI) Web Service';
    return 'Python Application';
  }

  if (files.includes('pom.xml') || files.includes('build.gradle')) return 'Java (Spring Boot / Gradle) Application';
  if (files.includes('go.mod')) return 'Go Application / Microservice';
  if (files.includes('cargo.toml')) return 'Rust Application / Binary';
  if (files.some(f => f.endsWith('.csproj'))) return '.NET / C# Application';

  if (language && language !== 'Code') return `${language} Project`;
  return 'General Software Repository';
};

export class GithubRepoInspectorService {
  /**
   * Inspect a GitHub repository and aggregate factual evidence for AI prompt grounding
   */
  public static async inspectRepository(
    githubUsername?: string,
    githubUrl?: string,
    storedReadme?: string
  ): Promise<RepoEvidence> {
    let parsed = parseGitHubUrl(githubUrl || '');
    let owner = parsed?.owner || githubUsername;
    let repo = parsed?.repo;

    if (!owner || !repo) {
      return {
        isGitHubRepo: false,
        existingReadme: storedReadme || '',
        evidenceMessage: 'Manual project input (no GitHub repository URL linked).',
      };
    }

    try {
      const headers = { 'User-Agent': 'Promptfolio-AI-OS' };

      // 1. Fetch Repository Metadata
      const repoRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { headers });
      if (!repoRes.ok) {
        return {
          isGitHubRepo: true,
          owner,
          repoName: repo,
          existingReadme: storedReadme || '',
          evidenceMessage: `Repository metadata fetch returned HTTP status ${repoRes.status}. Using stored metadata.`,
        };
      }

      const repoData = (await repoRes.json()) as any;
      const defaultBranch = repoData.default_branch || 'main';
      const description = repoData.description || '';
      const language = repoData.language || '';
      const topics = Array.isArray(repoData.topics) ? repoData.topics : [];
      const stars = repoData.stargazers_count || 0;
      const forks = repoData.forks_count || 0;

      // 2. Fetch Root Directory Contents
      let rootFiles: string[] = [];
      const contentsRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents`, { headers });
      if (contentsRes.ok) {
        const contentsData = (await contentsRes.json()) as any[];
        if (Array.isArray(contentsData)) {
          rootFiles = contentsData.map((item: any) => item.name);
        }
      }

      // 3. Inspect Manifest (package.json or requirements.txt if present)
      let dependencies: string[] = [];
      let devDependencies: string[] = [];
      let npmScripts: Record<string, string> = {};

      if (rootFiles.some(f => f.toLowerCase() === 'package.json')) {
        try {
          const pkgRes = await fetch(`https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(defaultBranch)}/package.json`, { headers });
          if (pkgRes.ok) {
            const pkgJson = (await pkgRes.json()) as any;
            if (pkgJson.dependencies) dependencies = Object.keys(pkgJson.dependencies);
            if (pkgJson.devDependencies) devDependencies = Object.keys(pkgJson.devDependencies);
            if (pkgJson.scripts) npmScripts = pkgJson.scripts;
          }
        } catch {
          // Soft failure for package.json parse
        }
      } else if (rootFiles.some(f => f.toLowerCase() === 'requirements.txt')) {
        try {
          const reqRes = await fetch(`https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(defaultBranch)}/requirements.txt`, { headers });
          if (reqRes.ok) {
            const reqText = await reqRes.text();
            dependencies = reqText
              .split('\n')
              .map(line => line.split('#')[0].trim().split('==')[0].trim())
              .filter(Boolean);
          }
        } catch {
          // Soft failure
        }
      }

      // 4. Fetch Existing README
      let existingReadme = storedReadme || '';
      if (!existingReadme) {
        try {
          const readmeRes = await fetch(`https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(defaultBranch)}/README.md`, { headers });
          if (readmeRes.ok) {
            existingReadme = await readmeRes.text();
          }
        } catch {
          // Soft failure
        }
      }

      // 5. Detect Project Type
      const detectedProjectType = detectProjectType(rootFiles, dependencies, devDependencies, language);

      return {
        isGitHubRepo: true,
        owner,
        repoName: repo,
        description,
        language,
        topics,
        stars,
        forks,
        defaultBranch,
        detectedProjectType,
        dependencies: dependencies.slice(0, 20),
        devDependencies: devDependencies.slice(0, 15),
        npmScripts,
        rootFiles: rootFiles.slice(0, 25),
        existingReadme: existingReadme.slice(0, 2000), // Cap existing README preview
        evidenceMessage: `Successfully verified GitHub repository evidence for ${owner}/${repo} (${detectedProjectType}).`,
      };
    } catch (error: any) {
      return {
        isGitHubRepo: true,
        owner,
        repoName: repo,
        existingReadme: storedReadme || '',
        evidenceMessage: `GitHub API connection error (${error.message || error}). Falling back to project metadata.`,
      };
    }
  }
}

export default GithubRepoInspectorService;
