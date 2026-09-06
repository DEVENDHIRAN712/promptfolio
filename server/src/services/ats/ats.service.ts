export interface AtsAnalysisResult {
  hasJobDescription: boolean;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  totalKeywords: number;
  message: string;
}

// Canonical dictionary of tech keywords and common aliases for normalization
const TECH_DICTIONARY: Record<string, string[]> = {
  'React': ['react', 'reactjs', 'react.js'],
  'Node.js': ['nodejs', 'node.js', 'node js', 'node'],
  'TypeScript': ['typescript', 'ts'],
  'JavaScript': ['javascript', 'js', 'es6'],
  'Next.js': ['nextjs', 'next.js', 'next js'],
  'Vue.js': ['vue', 'vuejs', 'vue.js'],
  'Angular': ['angular', 'angularjs'],
  'Python': ['python', 'py'],
  'Django': ['django'],
  'Flask': ['flask'],
  'FastAPI': ['fastapi'],
  'Express.js': ['express', 'expressjs', 'express.js'],
  'MongoDB': ['mongodb', 'mongo'],
  'PostgreSQL': ['postgresql', 'postgres', 'psql'],
  'MySQL': ['mysql'],
  'Redis': ['redis'],
  'Docker': ['docker'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services'],
  'Azure': ['azure'],
  'GCP': ['gcp', 'google cloud'],
  'GraphQL': ['graphql'],
  'REST API': ['rest', 'restful', 'rest api', 'api'],
  'Tailwind CSS': ['tailwind', 'tailwindcss', 'tailwind css'],
  'CSS3': ['css', 'css3'],
  'HTML5': ['html', 'html5'],
  'Git': ['git', 'github', 'gitlab'],
  'CI/CD': ['ci/cd', 'cicd', 'continuous integration'],
  'Microservices': ['microservices', 'microservice'],
  'Kafka': ['kafka', 'apache kafka'],
  'Elasticsearch': ['elasticsearch', 'elastic search'],
  'Jest': ['jest'],
  'Cypress': ['cypress'],
  'Prisma': ['prisma'],
  'Redux': ['redux'],
  'Java': ['java'],
  'Spring Boot': ['spring', 'spring boot'],
  'C++': ['c++', 'cpp'],
  'C#': ['c#', 'csharp', '.net', 'dotnet'],
  'Go': ['go', 'golang'],
  'Rust': ['rust'],
  'SQL': ['sql', 'nosql'],
  'DevOps': ['devops'],
  'System Architecture': ['system architecture', 'system design'],
};

/**
 * Extract matched canonical keywords from a given text string
 */
const extractKeywordsFromText = (text: string): Set<string> => {
  const found = new Set<string>();
  if (!text || typeof text !== 'string') return found;

  const lowerText = text.toLowerCase();

  for (const [canonicalName, aliases] of Object.entries(TECH_DICTIONARY)) {
    for (const alias of aliases) {
      // Escape special characters for regex match
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lowerText)) {
        found.add(canonicalName);
        break;
      }
    }
  }

  return found;
};

/**
 * Deterministically analyze candidate profile data against a Job Description
 */
export class AtsService {
  public static calculateMatch(jobDescription: string = '', profileData: any = {}): AtsAnalysisResult {
    const trimmedJd = (jobDescription || '').trim();

    if (!trimmedJd) {
      return {
        hasJobDescription: false,
        matchPercentage: 0,
        matchedKeywords: [],
        missingKeywords: [],
        totalKeywords: 0,
        message: 'Job description not provided',
      };
    }

    // 1. Extract required keywords from Job Description
    const jdKeywords = extractKeywordsFromText(trimmedJd);

    // 2. Extract candidate keywords across all collections
    const candidateTextParts: string[] = [];

    // Profile title & bio
    if (profileData.profile?.title) candidateTextParts.push(profileData.profile.title);
    if (profileData.profile?.bio) candidateTextParts.push(profileData.profile.bio);

    // Skills
    if (Array.isArray(profileData.skills)) {
      profileData.skills.forEach((s: any) => {
        if (s.name) candidateTextParts.push(s.name);
      });
    }

    // Projects
    if (Array.isArray(profileData.projects)) {
      profileData.projects.forEach((p: any) => {
        if (p.title) candidateTextParts.push(p.title);
        if (p.description) candidateTextParts.push(p.description);
        if (Array.isArray(p.technologies)) candidateTextParts.push(p.technologies.join(' '));
      });
    }

    // Experiences
    if (Array.isArray(profileData.experiences)) {
      profileData.experiences.forEach((e: any) => {
        if (e.role) candidateTextParts.push(e.role);
        if (e.company) candidateTextParts.push(e.company);
        if (e.description) candidateTextParts.push(e.description);
      });
    }

    // Educations & Certificates
    if (Array.isArray(profileData.educations)) {
      profileData.educations.forEach((ed: any) => {
        if (ed.degree) candidateTextParts.push(ed.degree);
        if (ed.fieldOfStudy) candidateTextParts.push(ed.fieldOfStudy);
      });
    }
    if (Array.isArray(profileData.certificates)) {
      profileData.certificates.forEach((c: any) => {
        if (c.title) candidateTextParts.push(c.title);
      });
    }

    // Parsed Resume Summary
    if (profileData.parsedResumeSummary) {
      if (typeof profileData.parsedResumeSummary === 'string') {
        candidateTextParts.push(profileData.parsedResumeSummary);
      } else if (typeof profileData.parsedResumeSummary === 'object') {
        candidateTextParts.push(JSON.stringify(profileData.parsedResumeSummary));
      }
    }

    const candidateCombinedText = candidateTextParts.join(' ');
    const candidateKeywords = extractKeywordsFromText(candidateCombinedText);

    // Also directly match raw skills string array
    if (Array.isArray(profileData.skills)) {
      profileData.skills.forEach((s: any) => {
        if (s.name && typeof s.name === 'string') {
          for (const [canonicalName, aliases] of Object.entries(TECH_DICTIONARY)) {
            if (aliases.some(alias => s.name.toLowerCase().includes(alias))) {
              candidateKeywords.add(canonicalName);
            }
          }
        }
      });
    }

    // 3. Compute overlap
    const jdKeywordsArray = Array.from(jdKeywords);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    jdKeywordsArray.forEach((kw) => {
      if (candidateKeywords.has(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const totalKeywords = jdKeywordsArray.length;
    const matchPercentage = totalKeywords > 0
      ? Math.min(100, Math.max(0, Math.round((matchedKeywords.length / totalKeywords) * 100)))
      : 0;

    return {
      hasJobDescription: true,
      matchPercentage,
      matchedKeywords,
      missingKeywords,
      totalKeywords,
      message: totalKeywords > 0
        ? `Matched ${matchedKeywords.length} of ${totalKeywords} extracted job keywords (${matchPercentage}%)`
        : 'Job description analyzed. No standard technical keywords detected.',
    };
  }
}

export default AtsService;
