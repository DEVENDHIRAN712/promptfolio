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
}

// Canonical dictionary of tech keywords with controlled aliases & negative boundary patterns
const TECH_DICTIONARY: TechSkillDef[] = [
  { canonical: 'Java', aliases: ['java'], negativePatterns: [/javascript/i, /java\s*script/i, /javadoc/i] },
  { canonical: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { canonical: 'TypeScript', aliases: ['typescript', 'ts'] },
  { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  { canonical: 'Node.js', aliases: ['node.js', 'nodejs', 'node js', 'node'] },
  { canonical: 'Express.js', aliases: ['express', 'expressjs', 'express.js'] },
  { canonical: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring framework'] },
  { canonical: 'SQL', aliases: ['sql', 'relational database', 'rdbms'], negativePatterns: [/nosql/i] },
  { canonical: 'NoSQL', aliases: ['nosql'] },
  { canonical: 'MongoDB', aliases: ['mongodb', 'mongo'] },
  { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'] },
  { canonical: 'MySQL', aliases: ['mysql'] },
  { canonical: 'Redis', aliases: ['redis'] },
  { canonical: 'Docker', aliases: ['docker', 'containerization', 'containers'] },
  { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'AWS', aliases: ['aws', 'amazon web services'] },
  { canonical: 'Azure', aliases: ['azure', 'microsoft azure'] },
  { canonical: 'GCP', aliases: ['gcp', 'google cloud'] },
  { canonical: 'GraphQL', aliases: ['graphql'] },
  { canonical: 'REST API', aliases: ['rest api', 'restful api', 'restful apis', 'rest apis', 'restful', 'rest'] },
  { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { canonical: 'CSS3', aliases: ['css', 'css3'] },
  { canonical: 'HTML5', aliases: ['html', 'html5'] },
  { canonical: 'Git', aliases: ['git', 'github', 'gitlab'] },
  { canonical: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration'] },
  { canonical: 'Microservices', aliases: ['microservices', 'microservice'] },
  { canonical: 'Kafka', aliases: ['kafka', 'apache kafka'] },
  { canonical: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search'] },
  { canonical: 'Jest', aliases: ['jest'] },
  { canonical: 'Cypress', aliases: ['cypress'] },
  { canonical: 'Python', aliases: ['python', 'py'] },
  { canonical: 'Django', aliases: ['django'] },
  { canonical: 'Flask', aliases: ['flask'] },
  { canonical: 'FastAPI', aliases: ['fastapi'] },
  { canonical: 'C++', aliases: ['c++', 'cpp'] },
  { canonical: 'C#', aliases: ['c#', 'csharp', '.net', 'dotnet'] },
  { canonical: 'Go', aliases: ['golang', 'go language'] },
  { canonical: 'Rust', aliases: ['rust'] },
  { canonical: 'System Architecture', aliases: ['system architecture', 'system design'] },
];

/**
  * Safely check if text contains canonical skill using word boundaries and negative patterns
  */
const matchSkillInText = (skillDef: TechSkillDef, text: string): boolean => {
  if (!text || typeof text !== 'string') return false;

  // First check if any negative boundary patterns match
  if (skillDef.negativePatterns) {
    for (const negReg of skillDef.negativePatterns) {
      // If negative pattern matches the entire text or word context, skip
      // E.g. for Java, if text ONLY contains JavaScript, we must be careful
    }
  }

  for (const alias of skillDef.aliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');

    if (regex.test(text)) {
      // Check negative boundary regex against the match context
      if (skillDef.negativePatterns) {
        let isNegative = false;
        for (const negReg of skillDef.negativePatterns) {
          // Check if the match is actually part of a negative pattern like JavaScript
          const matches = text.match(new RegExp(`\\b[a-zA-Z0-9_#\\+\\-\\.]*${escaped}[a-zA-Z0-9_#\\+\\-\\.]*\\b`, 'gi'));
          if (matches) {
            for (const m of matches) {
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
 * Extract matched canonical keywords from a given text string
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
 * Deterministically analyze candidate profile data against a Job Description
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

    // Parse JD text sections to split required vs preferred
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
      // If no explicit section header, top 65% of extracted keywords are required
      const reqCount = Math.ceil(allJdKeywords.length * 0.65);
      allJdKeywords.forEach((kw, index) => {
        if (index < reqCount) {
          requiredKeywords.push(kw);
        } else {
          preferredKeywords.push(kw);
        }
      });
    }

    // ----------------------------------------------------
    // 2. EXTRACT CANDIDATE EVIDENCE & EVALUATE STRENGTH
    // ----------------------------------------------------
    // Context Sources
    const strongEvidenceTextParts: string[] = [];
    const mediumEvidenceTextParts: string[] = [];

    // Experience descriptions & roles (Strong Evidence)
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

    // Parsed resume summary / text (Strong Evidence)
    if (profileData?.parsedResumeSummary) {
      if (typeof profileData.parsedResumeSummary === 'string') {
        strongEvidenceTextParts.push(profileData.parsedResumeSummary);
      } else if (typeof profileData.parsedResumeSummary === 'object') {
        strongEvidenceTextParts.push(JSON.stringify(profileData.parsedResumeSummary));
      }
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
        requiredEvidenceScoreSum += 1.0; // Strong Evidence
      } else if (mediumKeywords.has(kw)) {
        matchedRequiredKeywords.push(kw);
        requiredEvidenceScoreSum += 0.75; // Medium Evidence (skills list only)
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
        preferredEvidenceScoreSum += 0.75;
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
      techScore = (reqRatio * 30) + (prefRatio * 10);
    } else if (reqTotal > 0) {
      const reqRatio = requiredEvidenceScoreSum / reqTotal;
      techScore = reqRatio * 40;
    }

    techScore = Math.min(40, Math.max(0, Math.round(techScore)));

    // ----------------------------------------------------
    // 3. RESPONSIBILITY MATCHING (25 points max)
    // ----------------------------------------------------
    const responsibilityPatterns = [
      { id: 'api_dev', label: 'Develop & Architect REST APIs / Web Services', regex: /rest\s*api|microservices|backend\s*service|endpoints|web\s*service/i },
      { id: 'db_mgmt', label: 'Database Design & SQL / Data Modeling', regex: /database|sql|mongodb|postgresql|schema|data\s*model/i },
      { id: 'ui_dev', label: 'Frontend UI Development & Component Design', regex: /frontend|ui|user\s*interface|react|responsive|component/i },
      { id: 'testing', label: 'Automated Unit Testing & Quality Assurance', regex: /unit\s*test|testing|qa|jest|cypress|test-driven|tdd/i },
      { id: 'cloud_ops', label: 'Cloud Infrastructure & DevOps CI/CD', regex: /deploy|docker|kubernetes|aws|cloud|ci\/cd|devops/i },
      { id: 'debugging', label: 'Production Debugging & Performance Optimization', regex: /debug|troubleshoot|performance|optimization|monitoring/i },
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
      if (pattern && pattern.regex.test(strongTextCombined)) {
        matchedResponsibilities.push(label);
      } else {
        missingResponsibilities.push(label);
      }
    });

    let respScore = 20; // Default baseline if no explicit responsibilities detected in JD
    if (jdRequiredResponsibilities.length > 0) {
      respScore = Math.round((matchedResponsibilities.length / jdRequiredResponsibilities.length) * 25);
    }
    respScore = Math.min(25, Math.max(0, respScore));

    // ----------------------------------------------------
    // 4. EXPERIENCE & SENIORITY MATCHING (15 points max)
    // ----------------------------------------------------
    let requiredYears = 2; // Default 2 years baseline
    const yearMatch = trimmedJd.match(/(\d+)\+?\s*(?:-\s*\d+\s*)?years?/i);
    if (yearMatch) {
      requiredYears = parseInt(yearMatch[1], 10);
    } else if (/senior|lead|staff|principal/i.test(trimmedJd)) {
      requiredYears = 5;
    } else if (/junior|entry|intern/i.test(trimmedJd)) {
      requiredYears = 1;
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

    let expScore = 15;
    let expStatus: 'Match' | 'Partial Match' | 'Seniority Mismatch' | 'No Requirement' = 'Match';

    if (requiredYears > 0) {
      if (candidateYears >= requiredYears) {
        expScore = 15;
        expStatus = 'Match';
      } else if (candidateYears <= 1.0 && requiredYears >= 3) {
        // Seniority mismatch: Student/Intern applying for 3+ years role
        const ratio = candidateYears / requiredYears;
        expScore = Math.max(2, Math.round(15 * ratio));
        expStatus = 'Seniority Mismatch';
      } else if (candidateYears >= requiredYears * 0.7) {
        expScore = 11;
        expStatus = 'Partial Match';
      } else {
        const ratio = candidateYears / requiredYears;
        expScore = Math.max(3, Math.round(15 * ratio));
        expStatus = 'Partial Match';
      }
    } else {
      expStatus = 'No Requirement';
    }

    // ----------------------------------------------------
    // 5. EDUCATION MATCHING (10 points max)
    // ----------------------------------------------------
    const requiresEdu = /bachelor|master|degree|b\.s\.|b\.e\.|computer science|stem/i.test(trimmedJd);
    let eduScore = 8;
    let eduStatus: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement' = 'No Requirement';

    if (requiresEdu) {
      const candidateEduText = Array.isArray(profileData?.educations)
        ? profileData.educations.map((ed: any) => `${ed.degree} ${ed.fieldOfStudy}`).join(' ')
        : '';
      const fullEduText = `${candidateEduText} ${strongTextCombined}`.toLowerCase();

      if (/bachelor|bs|b\.s\.|b\.e\.|b\.tech|master|ms|m\.s\.|phd/i.test(fullEduText) && /computer science|software|engineering|stem|information/i.test(fullEduText)) {
        eduScore = 10;
        eduStatus = 'Match';
      } else if (/bachelor|degree|bs|b\.e\.|diploma/i.test(fullEduText)) {
        eduScore = 7;
        eduStatus = 'Partial Match';
      } else {
        eduScore = 2;
        eduStatus = 'No Match';
      }
    }

    // ----------------------------------------------------
    // 6. CERTIFICATIONS / OTHER (10 points max)
    // ----------------------------------------------------
    const certCount = Array.isArray(profileData?.certificates) ? profileData.certificates.length : 0;
    let certScore = certCount > 0 ? 10 : 7;
    let certStatus: 'Match' | 'Partial Match' | 'No Match' | 'No Requirement' = certCount > 0 ? 'Match' : 'No Requirement';

    // ----------------------------------------------------
    // 7. COMPOSITE ATS SCORE CALCULATION & CONSERVATIVE CAPS
    // ----------------------------------------------------
    let rawScore = techScore + respScore + expScore + eduScore + certScore;

    // Apply conservative caps for major missing requirements
    if (requiredKeywords.length > 0 && matchedRequiredKeywords.length === 0) {
      rawScore = Math.min(rawScore, 35);
    } else if (requiredKeywords.length > 0 && (matchedRequiredKeywords.length / requiredKeywords.length) < 0.5) {
      rawScore = Math.min(rawScore, 64);
    } else if (expStatus === 'Seniority Mismatch') {
      rawScore = Math.min(rawScore, 68);
    }

    const finalMatchPercentage = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Formulate Strong Matches and Missing Requirements lists
    const strongMatches: string[] = [
      ...matchedRequiredKeywords,
      ...matchedResponsibilities.slice(0, 3)
    ];

    const missingRequirements: string[] = [
      ...missingRequiredKeywords.map((k) => `Missing skill: ${k}`),
      ...missingResponsibilities.map((r) => `Missing competency: ${r}`)
    ];

    if (expStatus === 'Seniority Mismatch') {
      missingRequirements.push(`Seniority mismatch: ${candidateYears} yrs candidate vs ${requiredYears}+ yrs required`);
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
      message: `Deterministic ATS score: ${finalMatchPercentage}%. Matched ${matchedRequiredKeywords.length}/${requiredKeywords.length} required skills & ${matchedResponsibilities.length}/${jdRequiredResponsibilities.length || 'all'} key competencies.`,
    };
  }
}

export default AtsService;
