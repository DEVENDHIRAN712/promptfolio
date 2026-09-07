export interface AtsScoreBreakdown {
  technicalSkills: {
    score: number;
    maxScore: number;
    requiredMatched: number;
    requiredTotal: number;
    preferredMatched: number;
    preferredTotal: number;
  };
  responsibilities: {
    score: number;
    maxScore: number;
    matchedCount: number;
    totalCount: number;
  };
  experience: {
    score: number;
    maxScore: number;
    requiredYears: number;
    candidateYears: number;
    status: 'Match' | 'Partial Match' | 'Seniority Mismatch' | 'No Requirement';
  };
  education: {
    score: number;
    maxScore: number;
    status: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement';
  };
  certifications: {
    score: number;
    maxScore: number;
    status: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement';
  };
  domainAlignment: {
    jdDomain: string;
    candidateDomain: string;
    status: 'Aligned' | 'Partial Domain Match' | 'Domain Mismatch';
  };
}

export interface AtsAnalysisResult {
  hasJobDescription: boolean;
  matchPercentage: number;
  resumeHealthScore?: number;
  scoreBreakdown?: AtsScoreBreakdown;
  matchedRequiredKeywords: string[];
  missingRequiredKeywords: string[];
  matchedPreferredKeywords: string[];
  missingPreferredKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  totalKeywords: number;
  matchedResponsibilities: string[];
  missingResponsibilities: string[];
  strongMatches: string[];
  missingRequirements: string[];
  message: string;
}

interface TechSkillDef {
  canonical: string;
  aliases: string[];
  negativePatterns?: RegExp[];
  domain: 'Backend' | 'Frontend' | 'Database' | 'DevOps' | 'DataScience' | 'Mobile' | 'General';
}

// Comprehensive dictionary of canonical tech skills with strict negative boundary patterns
const TECH_DICTIONARY: TechSkillDef[] = [
  // Backend & Languages
  { canonical: 'Java', aliases: ['java'], negativePatterns: [/javascript/i, /java\s*script/i, /javadoc/i], domain: 'Backend' },
  { canonical: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring framework'], domain: 'Backend' },
  { canonical: 'Node.js', aliases: ['node.js', 'nodejs', 'node js', 'node'], domain: 'Backend' },
  { canonical: 'Express.js', aliases: ['express', 'expressjs', 'express.js'], domain: 'Backend' },
  { canonical: 'Python', aliases: ['python', 'py'], domain: 'Backend' },
  { canonical: 'Django', aliases: ['django'], domain: 'Backend' },
  { canonical: 'Flask', aliases: ['flask'], domain: 'Backend' },
  { canonical: 'FastAPI', aliases: ['fastapi'], domain: 'Backend' },
  { canonical: 'C++', aliases: ['c++', 'cpp'], domain: 'Backend' },
  { canonical: 'C#', aliases: ['c#', 'csharp', '.net', 'dotnet'], domain: 'Backend' },
  { canonical: 'Go', aliases: ['golang', 'go language'], domain: 'Backend' },
  { canonical: 'Rust', aliases: ['rust'], domain: 'Backend' },
  { canonical: 'Microservices', aliases: ['microservices', 'microservice'], domain: 'Backend' },
  { canonical: 'Kafka', aliases: ['kafka', 'apache kafka'], domain: 'Backend' },

  // Frontend
  { canonical: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'ecmascript'], domain: 'Frontend' },
  { canonical: 'TypeScript', aliases: ['typescript', 'ts'], domain: 'Frontend' },
  { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'], domain: 'Frontend' },
  { canonical: 'Next.js', aliases: ['nextjs', 'next.js', 'next js'], domain: 'Frontend' },
  { canonical: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js'], domain: 'Frontend' },
  { canonical: 'Angular', aliases: ['angular', 'angularjs'], domain: 'Frontend' },
  { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], domain: 'Frontend' },
  { canonical: 'CSS3', aliases: ['css', 'css3'], domain: 'Frontend' },
  { canonical: 'HTML5', aliases: ['html', 'html5'], domain: 'Frontend' },
  { canonical: 'Redux', aliases: ['redux'], domain: 'Frontend' },

  // Databases
  { canonical: 'SQL', aliases: ['sql', 'relational database', 'rdbms'], negativePatterns: [/nosql/i], domain: 'Database' },
  { canonical: 'NoSQL', aliases: ['nosql'], domain: 'Database' },
  { canonical: 'MongoDB', aliases: ['mongodb', 'mongo'], domain: 'Database' },
  { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'], domain: 'Database' },
  { canonical: 'MySQL', aliases: ['mysql'], domain: 'Database' },
  { canonical: 'Redis', aliases: ['redis'], domain: 'Database' },
  { canonical: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search'], domain: 'Database' },

  // DevOps & Cloud
  { canonical: 'Docker', aliases: ['docker', 'containerization', 'containers'], domain: 'DevOps' },
  { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s'], domain: 'DevOps' },
  { canonical: 'AWS', aliases: ['aws', 'amazon web services'], domain: 'DevOps' },
  { canonical: 'Azure', aliases: ['azure', 'microsoft azure'], domain: 'DevOps' },
  { canonical: 'GCP', aliases: ['gcp', 'google cloud'], domain: 'DevOps' },
  { canonical: 'Terraform', aliases: ['terraform'], domain: 'DevOps' },
  { canonical: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration', 'github actions'], domain: 'DevOps' },
  { canonical: 'Linux', aliases: ['linux', 'ubuntu', 'bash', 'shell'], domain: 'DevOps' },

  // Data Science & AI
  { canonical: 'Pandas', aliases: ['pandas'], domain: 'DataScience' },
  { canonical: 'NumPy', aliases: ['numpy'], domain: 'DataScience' },
  { canonical: 'Scikit-learn', aliases: ['scikit-learn', 'scikitlearn', 'sklearn'], domain: 'DataScience' },
  { canonical: 'Machine Learning', aliases: ['machine learning', 'ml', 'deep learning'], domain: 'DataScience' },
  { canonical: 'PyTorch', aliases: ['pytorch'], domain: 'DataScience' },
  { canonical: 'TensorFlow', aliases: ['tensorflow'], domain: 'DataScience' },

  // General & Testing
  { canonical: 'REST API', aliases: ['rest api', 'restful api', 'restful apis', 'rest apis', 'restful', 'rest'], domain: 'General' },
  { canonical: 'GraphQL', aliases: ['graphql'], domain: 'General' },
  { canonical: 'Git', aliases: ['git', 'github', 'gitlab'], domain: 'General' },
  { canonical: 'Jest', aliases: ['jest'], domain: 'General' },
  { canonical: 'Cypress', aliases: ['cypress'], domain: 'General' },
  { canonical: 'Testing', aliases: ['testing', 'unit testing', 'automated testing', 'tdd'], domain: 'General' },
  { canonical: 'System Architecture', aliases: ['system architecture', 'system design'], domain: 'General' },
];

/**
  * Safely check if text contains canonical skill using word boundaries and negative patterns
  */
const matchSkillInText = (skillDef: TechSkillDef, text: string): boolean => {
  if (!text || typeof text !== 'string') return false;

  for (const alias of skillDef.aliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');

    if (regex.test(text)) {
      if (skillDef.negativePatterns) {
        let isNegative = false;
        const matches = text.match(new RegExp(`\\b[a-zA-Z0-9_#\\+\\-\\.]*${escaped}[a-zA-Z0-9_#\\+\\-\\.]*\\b`, 'gi'));
        if (matches) {
          for (const m of matches) {
            for (const negReg of skillDef.negativePatterns) {
              if (negReg.test(m)) {
                isNegative = true;
                break;
              }
            }
          }
        }
        if (isNegative) continue;
      }
      return true;
    }
  }

  return false;
};

/**
 * Extract matched canonical keywords from text string
 */
const extractKeywordsFromText = (text: string): Set<string> => {
  const found = new Set<string>();
  if (!text || typeof text !== 'string') return found;

  for (const skillDef of TECH_DICTIONARY) {
    if (matchSkillInText(skillDef, text)) {
      found.add(skillDef.canonical);
    }
  }

  return found;
};

/**
 * Extract primary domain from JD or candidate text
 */
const detectDomain = (text: string): string => {
  const lower = (text || '').toLowerCase();
  if (/data scientist|machine learning|data science|ml engineer/i.test(lower)) return 'DataScience';
  if (/devops|site reliability|sre|cloud engineer|infrastructure/i.test(lower)) return 'DevOps';
  if (/frontend|react|ui developer|client-side|angular|vue/i.test(lower)) return 'Frontend';
  if (/backend|java developer|spring boot|python developer|node\.js developer|golang|microservices/i.test(lower)) return 'Backend';
  if (/mobile|ios|android|react native|flutter/i.test(lower)) return 'Mobile';
  if (/qa|test engineer|quality assurance/i.test(lower)) return 'QA';
  if (/full stack|fullstack/i.test(lower)) return 'FullStack';
  return 'General';
};

/**
 * Strict Top-MNC-Style ATS Service
 */
export class AtsService {
  public static calculateMatch(jobDescription: string = '', profileData: any = {}): AtsAnalysisResult {
    const trimmedJd = (jobDescription || '').trim();

    // ----------------------------------------------------
    // NO-JD BEHAVIOR: Compute Resume Health score instead of fake ATS job match
    // ----------------------------------------------------
    if (!trimmedJd) {
      let healthScore = 0;
      const user = profileData?.user || {};
      const profile = profileData?.profile || {};
      const skills = Array.isArray(profileData?.skills) ? profileData.skills : [];
      const projects = Array.isArray(profileData?.projects) ? profileData.projects : [];
      const experiences = Array.isArray(profileData?.experiences) ? profileData.experiences : [];
      const educations = Array.isArray(profileData?.educations) ? profileData.educations : [];
      const certificates = Array.isArray(profileData?.certificates) ? profileData.certificates : [];

      if (user.email && user.name) healthScore += 20;
      if (profile.title || profile.bio) healthScore += 15;
      if (skills.length >= 3) healthScore += 20;
      if (projects.length >= 1) healthScore += 20;
      if (experiences.length >= 1) healthScore += 15;
      if (educations.length >= 1 || certificates.length >= 1) healthScore += 10;

      return {
        hasJobDescription: false,
        matchPercentage: 0,
        resumeHealthScore: healthScore,
        matchedRequiredKeywords: [],
        missingRequiredKeywords: [],
        matchedPreferredKeywords: [],
        missingPreferredKeywords: [],
        matchedKeywords: [],
        missingKeywords: [],
        totalKeywords: 0,
        matchedResponsibilities: [],
        missingResponsibilities: [],
        strongMatches: [],
        missingRequirements: [],
        message: 'Add a Job Description to calculate ATS Match',
      };
    }

    // ----------------------------------------------------
    // 1. EXTRACT & CLASSIFY JD REQUIREMENTS (Required vs Preferred)
    // ----------------------------------------------------
    const allJdKeywords = Array.from(extractKeywordsFromText(trimmedJd));
    const requiredKeywords: string[] = [];
    const preferredKeywords: string[] = [];

    const lowerJd = trimmedJd.toLowerCase();
    const preferredHeaders = ['nice to have', 'preferred', 'bonus', 'plus', 'desirable', 'optional', 'good to have'];
    let preferredStartIndex = -1;

    for (const header of preferredHeaders) {
      const idx = lowerJd.indexOf(header);
      if (idx !== -1 && (preferredStartIndex === -1 || idx < preferredStartIndex)) {
        preferredStartIndex = idx;
      }
    }

    if (preferredStartIndex !== -1) {
      const requiredText = trimmedJd.substring(0, preferredStartIndex);
      const preferredText = trimmedJd.substring(preferredStartIndex);

      const reqSet = extractKeywordsFromText(requiredText);
      const prefSet = extractKeywordsFromText(preferredText);

      allJdKeywords.forEach((kw) => {
        if (reqSet.has(kw)) {
          requiredKeywords.push(kw);
        } else if (prefSet.has(kw)) {
          preferredKeywords.push(kw);
        } else {
          requiredKeywords.push(kw);
        }
      });
    } else {
      // Top 70% of extracted keywords are required
      const reqCount = Math.ceil(allJdKeywords.length * 0.7);
      allJdKeywords.forEach((kw, index) => {
        if (index < reqCount) {
          requiredKeywords.push(kw);
        } else {
          preferredKeywords.push(kw);
        }
      });
    }

    // ----------------------------------------------------
    // 2. EXTRACT CANDIDATE EVIDENCE (EXCLUDING AI-GENERATED TEXT)
    // ----------------------------------------------------
    // Context Sources (ONLY real candidate profile data from DB)
    const strongEvidenceTextParts: string[] = [];
    const mediumEvidenceTextParts: string[] = [];

    // Experience roles & descriptions (Strong Evidence)
    if (Array.isArray(profileData?.experiences)) {
      profileData.experiences.forEach((e: any) => {
        if (e.role) strongEvidenceTextParts.push(e.role);
        if (e.description) strongEvidenceTextParts.push(e.description);
      });
    }

    // Projects titles, descriptions, technologies (Strong Evidence)
    if (Array.isArray(profileData?.projects)) {
      profileData.projects.forEach((p: any) => {
        if (p.title) strongEvidenceTextParts.push(p.title);
        if (p.description) strongEvidenceTextParts.push(p.description);
        if (Array.isArray(p.technologies)) strongEvidenceTextParts.push(p.technologies.join(' '));
      });
    }

    // Skills array & Profile Title/Bio (Medium Evidence)
    if (profileData?.profile?.title) mediumEvidenceTextParts.push(profileData.profile.title);
    if (profileData?.profile?.bio) mediumEvidenceTextParts.push(profileData.profile.bio);
    if (Array.isArray(profileData?.skills)) {
      profileData.skills.forEach((s: any) => {
        if (s.name) mediumEvidenceTextParts.push(s.name);
      });
    }

    const strongTextCombined = strongEvidenceTextParts.join(' ');
    const mediumTextCombined = mediumEvidenceTextParts.join(' ');

    const strongKeywords = extractKeywordsFromText(strongTextCombined);
    const mediumKeywords = extractKeywordsFromText(mediumTextCombined);

    // Evaluate evidence strength for matched skills
    const matchedRequiredKeywords: string[] = [];
    const missingRequiredKeywords: string[] = [];
    const matchedPreferredKeywords: string[] = [];
    const missingPreferredKeywords: string[] = [];

    let requiredEvidenceScoreSum = 0;
    requiredKeywords.forEach((kw) => {
      if (strongKeywords.has(kw)) {
        matchedRequiredKeywords.push(kw);
        requiredEvidenceScoreSum += 1.0; // Strong Evidence (Experience / Projects)
      } else if (mediumKeywords.has(kw)) {
        matchedRequiredKeywords.push(kw);
        requiredEvidenceScoreSum += 0.5; // Medium Evidence (Skills list only)
      } else {
        missingRequiredKeywords.push(kw);
      }
    });

    let preferredEvidenceScoreSum = 0;
    preferredKeywords.forEach((kw) => {
      if (strongKeywords.has(kw)) {
        matchedPreferredKeywords.push(kw);
        preferredEvidenceScoreSum += 1.0;
      } else if (mediumKeywords.has(kw)) {
        matchedPreferredKeywords.push(kw);
        preferredEvidenceScoreSum += 0.5;
      } else {
        missingPreferredKeywords.push(kw);
      }
    });

    // Technical Skills Score Calculation (40 points max)
    let techScore = 0;
    const reqTotal = requiredKeywords.length;
    const prefTotal = preferredKeywords.length;

    if (reqTotal > 0 && prefTotal > 0) {
      const reqRatio = requiredEvidenceScoreSum / reqTotal;
      const prefRatio = preferredEvidenceScoreSum / prefTotal;
      techScore = (reqRatio * 32) + (prefRatio * 8); // 80% weight on required, 20% on preferred
    } else if (reqTotal > 0) {
      const reqRatio = requiredEvidenceScoreSum / reqTotal;
      techScore = reqRatio * 40;
    }

    techScore = Math.min(40, Math.max(0, Math.round(techScore)));

    // ----------------------------------------------------
    // 3. RESPONSIBILITY MATCHING (25 points max - ZERO BASELINE)
    // ----------------------------------------------------
    const responsibilityPatterns = [
      { id: 'api_dev', label: 'Develop & Architect REST APIs / Web Services', regex: /rest\s*api|microservices|backend\s*service|endpoints|web\s*service/i, contextRegex: /built\s*api|developed\s*api|created\s*api|implemented\s*api|architected\s*api|endpoint/i },
      { id: 'db_mgmt', label: 'Database Design & SQL / Data Modeling', regex: /database|sql|mongodb|postgresql|schema|data\s*model/i, contextRegex: /designed\s*database|created\s*schema|written\s*sql|optimized\s*query|mongo|postgres/i },
      { id: 'ui_dev', label: 'Frontend UI Development & Component Architecture', regex: /frontend|ui|user\s*interface|react|responsive|component/i, contextRegex: /built\s*ui|developed\s*component|created\s*frontend|react\s*app|responsive/i },
      { id: 'testing', label: 'Automated Unit Testing & Quality Assurance', regex: /unit\s*test|testing|qa|jest|cypress|test-driven|tdd/i, contextRegex: /written\s*test|unit\s*testing|jest|cypress|test\s*coverage/i },
      { id: 'cloud_ops', label: 'Cloud Infrastructure & DevOps CI/CD', regex: /deploy|docker|kubernetes|aws|cloud|ci\/cd|devops/i, contextRegex: /deployed|docker\s*container|kubernetes|aws\s*cloud|ci\/cd\s*pipeline/i },
      { id: 'debugging', label: 'Production Debugging & Performance Optimization', regex: /debug|troubleshoot|performance|optimization|monitoring/i, contextRegex: /debugged|troubleshot|optimized\s*performance|monitored|resolved\s*issue/i },
    ];

    const jdRequiredResponsibilities: string[] = [];
    responsibilityPatterns.forEach((p) => {
      if (p.regex.test(trimmedJd)) {
        jdRequiredResponsibilities.push(p.label);
      }
    });

    const matchedResponsibilities: string[] = [];
    const missingResponsibilities: string[] = [];

    // Match candidate strong evidence text against required responsibilities
    jdRequiredResponsibilities.forEach((label) => {
      const pattern = responsibilityPatterns.find((p) => p.label === label);
      if (pattern && (pattern.contextRegex.test(strongTextCombined) || pattern.regex.test(strongTextCombined))) {
        matchedResponsibilities.push(label);
      } else {
        missingResponsibilities.push(label);
      }
    });

    let respScore = 0; // ZERO DEFAULT BASELINE
    if (jdRequiredResponsibilities.length > 0) {
      respScore = Math.round((matchedResponsibilities.length / jdRequiredResponsibilities.length) * 25);
    } else {
      // If no explicit responsibilities detected in JD, evaluate candidate's action verbs in experience context
      const actionVerbMatch = (strongTextCombined.match(/built|developed|designed|implemented|engineered|architected|managed|created/gi) || []).length;
      respScore = Math.min(15, actionVerbMatch * 3);
    }
    respScore = Math.min(25, Math.max(0, respScore));

    // ----------------------------------------------------
    // 4. EXPERIENCE & SENIORITY MATCHING (15 points max - ZERO BASELINE)
    // ----------------------------------------------------
    let requiredYears = 0;
    const yearMatch = trimmedJd.match(/(\d+)\+?\s*(?:-\s*\d+\s*)?years?/i);
    if (yearMatch) {
      requiredYears = parseInt(yearMatch[1], 10);
    } else if (/senior|lead|staff|principal/i.test(trimmedJd)) {
      requiredYears = 5;
    } else if (/mid-level|mid level|3\+ years/i.test(trimmedJd)) {
      requiredYears = 3;
    } else if (/junior|1\+ year/i.test(trimmedJd)) {
      requiredYears = 1;
    } else if (/intern|fresher|entry/i.test(trimmedJd)) {
      requiredYears = 0.5;
    }

    // Calculate candidate total experience in years from experiences array
    let candidateYears = 0;
    if (Array.isArray(profileData?.experiences) && profileData.experiences.length > 0) {
      profileData.experiences.forEach((e: any) => {
        let start = e.startDate ? new Date(e.startDate) : null;
        let end = e.current || !e.endDate ? new Date() : new Date(e.endDate);
        if (start && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          if (diffYears > 0) candidateYears += diffYears;
        }
      });
      candidateYears = Math.round(candidateYears * 10) / 10;
    }

    let expScore = 0; // ZERO DEFAULT BASELINE
    let expStatus: 'Match' | 'Partial Match' | 'Seniority Mismatch' | 'No Requirement' = 'Match';

    if (requiredYears > 0) {
      if (candidateYears >= requiredYears) {
        expScore = 15;
        expStatus = 'Match';
      } else if (candidateYears <= 1.0 && requiredYears >= 3) {
        // Seniority Mismatch: Student/Intern applying for 3+ years role
        const ratio = candidateYears / requiredYears;
        expScore = Math.max(1, Math.round(15 * ratio));
        expStatus = 'Seniority Mismatch';
      } else if (candidateYears >= requiredYears * 0.7) {
        expScore = 10;
        expStatus = 'Partial Match';
      } else {
        const ratio = candidateYears / requiredYears;
        expScore = Math.max(2, Math.round(15 * ratio));
        expStatus = 'Partial Match';
      }
    } else {
      expScore = candidateYears > 0 ? 12 : 5;
      expStatus = 'No Requirement';
    }

    // ----------------------------------------------------
    // 5. EDUCATION MATCHING (10 points max - ZERO BASELINE)
    // ----------------------------------------------------
    const requiresEdu = /bachelor|master|degree|b\.s\.|b\.e\.|computer science|stem/i.test(trimmedJd);
    let eduScore = 0; // ZERO DEFAULT BASELINE
    let eduStatus: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement' = 'No Requirement';

    const candidateEduText = Array.isArray(profileData?.educations)
      ? profileData.educations.map((ed: any) => `${ed.degree} ${ed.fieldOfStudy}`).join(' ')
      : '';
    const fullEduText = `${candidateEduText} ${strongTextCombined}`.toLowerCase();

    if (requiresEdu) {
      if (/bachelor|bs|b\.s\.|b\.e\.|b\.tech|master|ms|m\.s\.|phd/i.test(fullEduText) && /computer science|software|engineering|stem|information/i.test(fullEduText)) {
        eduScore = 10;
        eduStatus = 'Match';
      } else if (/bachelor|degree|bs|b\.e\.|diploma/i.test(fullEduText)) {
        eduScore = 6;
        eduStatus = 'Partial Match';
      } else {
        eduScore = 0; // ZERO POINTS IF MISSING
        eduStatus = 'No Match';
      }
    } else {
      eduScore = 0; // ZERO CONTRIBUTION WHEN NOT REQUIRED
      eduStatus = 'No Requirement';
    }

    // ----------------------------------------------------
    // 6. CERTIFICATIONS MATCHING (10 points max - ZERO BASELINE)
    // ----------------------------------------------------
    const certCount = Array.isArray(profileData?.certificates) ? profileData.certificates.length : 0;
    const requiresCert = /certified|certification|aws certified|cka|pmp|scrum master/i.test(trimmedJd);
    let certScore = 0; // ZERO DEFAULT BASELINE
    let certStatus: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement' = 'No Requirement';

    if (requiresCert) {
      if (certCount > 0) {
        certScore = 10;
        certStatus = 'Match';
      } else {
        certScore = 0; // ZERO POINTS IF REQUIRED AND MISSING
        certStatus = 'No Match';
      }
    } else {
      certScore = 0; // ZERO CONTRIBUTION WHEN NOT REQUIRED
      certStatus = 'No Requirement';
    }

    // ----------------------------------------------------
    // 7. PRIMARY ROLE / DOMAIN ALIGNMENT CHECK
    // ----------------------------------------------------
    const jdDomain = detectDomain(trimmedJd);
    
    // Prioritize candidate profile title & experience roles for candidate domain detection
    const candidateTitleText = [
      profileData?.profile?.title || '',
      Array.isArray(profileData?.experiences) ? profileData.experiences.map((e: any) => e.role || '').join(' ') : ''
    ].join(' ');
    
    let candidateDomain = detectDomain(candidateTitleText);
    if (candidateDomain === 'General') {
      const candidateTextCombined = `${profileData?.profile?.bio || ''} ${strongTextCombined} ${mediumTextCombined}`;
      candidateDomain = detectDomain(candidateTextCombined);
    }

    let domainStatus: 'Aligned' | 'Partial Domain Match' | 'Domain Mismatch' = 'Aligned';
    let domainMultiplier = 1.0;

    if (jdDomain !== 'General' && candidateDomain !== 'General') {
      if (jdDomain === candidateDomain || candidateDomain === 'FullStack') {
        domainStatus = 'Aligned';
        domainMultiplier = 1.0;
      } else if (
        (jdDomain === 'Backend' && candidateDomain === 'FullStack') ||
        (jdDomain === 'Frontend' && candidateDomain === 'FullStack')
      ) {
        domainStatus = 'Partial Domain Match';
        domainMultiplier = 0.9;
      } else {
        domainStatus = 'Domain Mismatch';
        domainMultiplier = 0.5; // 50% penalty for complete role mismatch (e.g. Frontend applying for DevOps or Data Science)
      }
    }

    // ----------------------------------------------------
    // 8. COMPOSITE ATS SCORE CALCULATION & CONSERVATIVE CAPS
    // ----------------------------------------------------
    // Denominator dynamically includes only applicable categories
    const maxApplicablePoints = 40 + 25 + 15 + (requiresEdu ? 10 : 0) + (requiresCert ? 10 : 0);
    const earnedPoints = techScore + respScore + expScore + (requiresEdu ? eduScore : 0) + (requiresCert ? certScore : 0);
    let rawScore = (earnedPoints / maxApplicablePoints) * 100 * domainMultiplier;

    // Apply strict conservative caps for major missing requirements
    if (requiredKeywords.length > 0 && matchedRequiredKeywords.length === 0) {
      rawScore = Math.min(rawScore, 20); // 0 required skills matched = max 20%
    } else if (requiredKeywords.length > 0 && (matchedRequiredKeywords.length / requiredKeywords.length) < 0.4) {
      rawScore = Math.min(rawScore, 45); // <40% required skills matched = max 45%
    } else if (requiredKeywords.length > 0 && (matchedRequiredKeywords.length / requiredKeywords.length) < 0.6) {
      rawScore = Math.min(rawScore, 62); // <60% required skills matched = max 62%
    }

    if (expStatus === 'Seniority Mismatch') {
      rawScore = Math.min(rawScore, 58); // Seniority mismatch = max 58%
    }

    if (domainStatus === 'Domain Mismatch') {
      rawScore = Math.min(rawScore, 38); // Domain mismatch = max 38%
    }

    const finalMatchPercentage = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Formulate Strong Matches and Missing Requirements lists
    const strongMatches: string[] = [
      ...matchedRequiredKeywords,
      ...matchedResponsibilities.slice(0, 3)
    ];

    const missingRequirements: string[] = [
      ...missingRequiredKeywords.map((k) => `Missing required skill: ${k}`),
      ...missingResponsibilities.map((r) => `Missing competency: ${r}`)
    ];

    if (expStatus === 'Seniority Mismatch') {
      missingRequirements.push(`Seniority gap: ${candidateYears} yrs experience vs ${requiredYears}+ yrs required`);
    }

    if (domainStatus === 'Domain Mismatch') {
      missingRequirements.push(`Role mismatch: Target role is ${jdDomain}, candidate background is ${candidateDomain}`);
    }

    if (eduStatus === 'No Match') {
      missingRequirements.push('Missing required CS/STEM degree');
    }

    if (certStatus === 'No Match') {
      missingRequirements.push('Missing required cloud/industry certification');
    }

    const allMatchedKeywords = [...matchedRequiredKeywords, ...matchedPreferredKeywords];
    const allMissingKeywords = [...missingRequiredKeywords, ...missingPreferredKeywords];

    return {
      hasJobDescription: true,
      matchPercentage: finalMatchPercentage,
      scoreBreakdown: {
        technicalSkills: {
          score: techScore,
          maxScore: 40,
          requiredMatched: matchedRequiredKeywords.length,
          requiredTotal: requiredKeywords.length,
          preferredMatched: matchedPreferredKeywords.length,
          preferredTotal: preferredKeywords.length,
        },
        responsibilities: {
          score: respScore,
          maxScore: 25,
          matchedCount: matchedResponsibilities.length,
          totalCount: jdRequiredResponsibilities.length,
        },
        experience: {
          score: expScore,
          maxScore: 15,
          requiredYears,
          candidateYears,
          status: expStatus,
        },
        education: {
          score: eduScore,
          maxScore: 10,
          status: eduStatus,
        },
        certifications: {
          score: certScore,
          maxScore: 10,
          status: certStatus,
        },
        domainAlignment: {
          jdDomain,
          candidateDomain,
          status: domainStatus,
        },
      },
      matchedRequiredKeywords,
      missingRequiredKeywords,
      matchedPreferredKeywords,
      missingPreferredKeywords,
      matchedKeywords: allMatchedKeywords,
      missingKeywords: allMissingKeywords,
      totalKeywords: allJdKeywords.length,
      matchedResponsibilities,
      missingResponsibilities,
      strongMatches,
      missingRequirements,
      message: `Strict ATS V2 score: ${finalMatchPercentage}%. Matched ${matchedRequiredKeywords.length}/${requiredKeywords.length} required skills & ${matchedResponsibilities.length}/${jdRequiredResponsibilities.length || 'all'} key competencies.`,
    };
  }
}

export default AtsService;
