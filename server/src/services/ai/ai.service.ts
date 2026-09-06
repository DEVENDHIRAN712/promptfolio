import { GeminiService } from './gemini.service';
import { AtsService } from '../ats/ats.service';
import { GithubRepoInspectorService } from '../github/githubRepoInspector.service';
import { PORTFOLIO_PROMPT_TEMPLATE } from './prompts/portfolio.prompt';
import { RESUME_PROMPT_TEMPLATE } from './prompts/resume.prompt';
import { COVER_LETTER_PROMPT_TEMPLATE } from './prompts/cover-letter.prompt';
import { LINKEDIN_PROMPT_TEMPLATE } from './prompts/linkedin.prompt';
import { README_PROMPT_TEMPLATE } from './prompts/readme.prompt';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { Experience } from '../../models/Experience';
import { Education } from '../../models/Education';
import { Skill } from '../../models/Skill';
import { Project } from '../../models/Project';
import { Certificate } from '../../models/Certificate';
import { GitHubConnection } from '../../models/GitHubConnection';
import { Resume } from '../../models/Resume';

export class AiService {
  /**
   * Aggregate candidate's complete modular profile data across all collections
   */
  public static async getCandidateProfileData(userId: string): Promise<any> {
    const [user, profile, experiences, educations, skills, projects, certificates, github, resume] = await Promise.all([
      User.findById(userId).select('-passwordHash'),
      Profile.findOne({ userId }),
      Experience.find({ userId }).sort({ startDate: -1 }),
      Education.find({ userId }).sort({ startDate: -1 }),
      Skill.find({ userId }),
      Project.find({ userId }).sort({ featured: -1, createdAt: -1 }),
      Certificate.find({ userId }).sort({ issueDate: -1 }),
      GitHubConnection.findOne({ userId }),
      Resume.findOne({ userId }).sort({ uploadedAt: -1 }),
    ]);

    return {
      user: {
        name: user?.name || 'Candidate',
        email: user?.email || '',
        role: user?.role || 'user',
      },
      profile: profile || {},
      experiences: experiences || [],
      educations: educations || [],
      skills: skills || [],
      projects: projects || [],
      certificates: certificates || [],
      github: github ? { username: github.username, publicRepos: github.publicRepos } : null,
      parsedResumeSummary: resume?.parsedData || null,
    };
  }

  /**
   * 1. Generate Structured Portfolio JSON
   */
  public static async generatePortfolio(userId: string, focusArea: string = ''): Promise<any> {
    const profileData = await this.getCandidateProfileData(userId);
    const candidateSkillsStr = Array.isArray(profileData.skills) && profileData.skills.length > 0
      ? profileData.skills.map((s: any) => s.name).slice(0, 5).join(', ')
      : '';
    const derivedFocusArea = focusArea || profileData.profile?.title || candidateSkillsStr || 'Software Engineering';

    const prompt = GeminiService.loadPromptTemplate(PORTFOLIO_PROMPT_TEMPLATE, {
      profileData,
      focusArea: derivedFocusArea,
    });

    return GeminiService.generateJson(prompt, ['portfolioTitle', 'heroSection', 'aboutSummary', 'coreCompetencies']);
  }

  /**
   * 2. Generate Structured Resume JSON (ATS, Modern, or Minimal)
   */
  public static async generateResume(
    userId: string,
    style: 'ATS' | 'Modern' | 'Minimal' = 'ATS',
    jobTitle: string = '',
    targetCompany: string = '',
    jobDescription: string = ''
  ): Promise<any> {
    const profileData = await this.getCandidateProfileData(userId);
    const derivedJobTitle = jobTitle || profileData.profile?.title || 'Software Engineer';
    const derivedCompany = targetCompany || 'Target Company';

    const prompt = GeminiService.loadPromptTemplate(RESUME_PROMPT_TEMPLATE, {
      style,
      jobTitle: derivedJobTitle,
      targetCompany: derivedCompany,
      jobDescription: jobDescription || 'Standard software engineering position requirements.',
      profileData,
    });

    const resume = await GeminiService.generateJson(prompt, ['header', 'executiveSummary', 'skillsSection', 'experience', 'projects']);

    // Calculate deterministic ATS match percentage using AtsService
    const atsAnalysis = AtsService.calculateMatch(jobDescription, profileData);

    return {
      ...resume,
      atsAnalysis,
    };
  }

  /**
   * 3. Generate Tailored Cover Letter JSON based on Job Title, Company, and Job Description
   */
  public static async generateCoverLetter(
    userId: string,
    jobTitle: string = '',
    company: string = '',
    jobDescription: string = ''
  ): Promise<any> {
    const profileData = await this.getCandidateProfileData(userId);
    const derivedJobTitle = jobTitle || profileData.profile?.title || 'Software Engineer';
    const derivedCompany = company || 'Target Company';

    const prompt = GeminiService.loadPromptTemplate(COVER_LETTER_PROMPT_TEMPLATE, {
      jobTitle: derivedJobTitle,
      company: derivedCompany,
      jobDescription: jobDescription || 'Standard software engineering position requirements.',
      profileData,
    });

    return GeminiService.generateJson(prompt, ['header', 'greeting', 'openingHook', 'bodyParagraphs', 'fullCoverLetterText']);
  }

  /**
   * 4. Generate LinkedIn Makeover JSON (Headline, About, and Experience Rewrite)
   */
  public static async generateLinkedIn(
    userId: string,
    jobTarget: string = '',
    focusArea: string = ''
  ): Promise<any> {
    const profileData = await this.getCandidateProfileData(userId);
    const candidateSkillsStr = Array.isArray(profileData.skills) && profileData.skills.length > 0
      ? profileData.skills.map((s: any) => s.name).slice(0, 5).join(', ')
      : '';
    const derivedJobTarget = jobTarget || profileData.profile?.title || 'Software Engineer';
    const derivedFocusArea = focusArea || candidateSkillsStr || 'Software Development';

    const prompt = GeminiService.loadPromptTemplate(LINKEDIN_PROMPT_TEMPLATE, {
      jobTarget: derivedJobTarget,
      focusArea: derivedFocusArea,
      profileData,
    });

    return GeminiService.generateJson(prompt, ['headlineOptions', 'aboutSection', 'experienceRewrites']);
  }

  /**
   * 5. Generate Production-Quality GitHub README.md JSON
   */
  public static async generateReadme(
    userId: string,
    projectId?: string,
    customProjectName?: string,
    customDescription?: string,
    customTechnologies?: string[]
  ): Promise<any> {
    const profileData = await this.getCandidateProfileData(userId);
    let projectName = customProjectName || 'Software-Project';
    let projectDescription = customDescription || 'Full-stack software application.';
    let technologies = Array.isArray(customTechnologies) && customTechnologies.length > 0
      ? customTechnologies.join(', ')
      : (customTechnologies || (Array.isArray(profileData.skills) && profileData.skills.length > 0 ? profileData.skills.map((s: any) => s.name).slice(0, 5).join(', ') : 'Software Development'));

    let githubUrl = '';
    let storedReadme = '';

    if (projectId) {
      const proj = await Project.findOne({ _id: projectId, userId });
      if (proj) {
        projectName = proj.title || projectName;
        projectDescription = proj.description || projectDescription;
        technologies = Array.isArray(proj.technologies) && proj.technologies.length > 0 ? proj.technologies.join(', ') : technologies;
        githubUrl = proj.githubUrl || '';
        storedReadme = proj.readme || '';
      }
    }

    // Inspect real GitHub repository evidence if available
    const repoEvidence = await GithubRepoInspectorService.inspectRepository(
      profileData.github?.username,
      githubUrl || customProjectName,
      storedReadme
    );

    const prompt = GeminiService.loadPromptTemplate(README_PROMPT_TEMPLATE, {
      projectName,
      projectDescription,
      technologies,
      authorName: profileData.user.name,
      githubUsername: profileData.github?.username || 'developer',
      repoEvidence,
    });

    const readme = await GeminiService.generateJson(prompt, ['projectTitle', 'tagline', 'markdown', 'sections']);

    return {
      ...readme,
      repoEvidence,
    };
  }
}

export default AiService;
