import AtsService from './ats.service';

function runAtsTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING DETERMINISTIC ATS SERVICE UNIT TESTS');
  console.log('==================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail: string = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] Test ${total}: ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Test ${total}: ${testName}`);
      if (detail) console.error(`   └─ ${detail}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1 — Strong Match
  // ----------------------------------------------------
  const strongCandidate = {
    user: { name: 'Alex Developer', email: 'alex@test.com' },
    profile: { title: 'Senior Backend Engineer', bio: 'Expert Java & Spring Boot engineer.' },
    skills: [
      { name: 'Java' }, { name: 'Spring Boot' }, { name: 'SQL' },
      { name: 'REST API' }, { name: 'Docker' }, { name: 'AWS' }
    ],
    projects: [
      {
        title: 'Microservice E-Commerce Platform',
        description: 'Engineered REST APIs using Java and Spring Boot. Optimized PostgreSQL SQL queries and deployed Docker containers on AWS.',
        technologies: ['Java', 'Spring Boot', 'SQL', 'REST API', 'Docker', 'AWS']
      }
    ],
    experiences: [
      {
        role: 'Senior Software Engineer',
        company: 'TechCorp',
        description: 'Architected scalable REST APIs with Spring Boot and Java. Managed MongoDB and PostgreSQL databases.',
        startDate: '2020-01-01',
        endDate: '2025-01-01',
        current: false
      }
    ],
    educations: [
      { degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', institution: 'State University' }
    ],
    certificates: [
      { title: 'AWS Certified Solutions Architect' }
    ]
  };

  const fullStackJd = `
    Target Position: Senior Backend Engineer
    Requirements:
    - 5+ years professional experience building web applications
    - Strong expertise in Java and Spring Boot
    - Deep knowledge of SQL databases and REST API architecture
    Nice to Have:
    - Docker containerization and AWS cloud deployment experience
    - Bachelor's degree in Computer Science
  `;

  const res1 = AtsService.calculateMatch(fullStackJd, strongCandidate);
  assert(
    res1.matchPercentage >= 80 && res1.matchPercentage <= 98,
    'Strong Match Candidate Score Range',
    `Calculated Score: ${res1.matchPercentage}% (Expected 80-98%)`
  );

  // ----------------------------------------------------
  // TEST 2 — Partial Match (User's Exact Example)
  // ----------------------------------------------------
  const partialCandidate = {
    user: { name: 'Dev Candidate', email: 'dev@test.com' },
    profile: { title: 'Full Stack Developer', bio: 'Building web applications.' },
    skills: [
      { name: 'Java' }, { name: 'SQL' }, { name: 'REST API' }
    ],
    projects: [
      {
        title: 'Web API Project',
        description: 'Built REST APIs using Java and SQL database.',
        technologies: ['Java', 'SQL', 'REST API']
      }
    ],
    experiences: [
      {
        role: 'Software Engineer',
        company: 'DevStudio',
        description: 'Developed REST API features using Java and SQL.',
        startDate: '2022-01-01',
        current: true
      }
    ]
  };

  const res2 = AtsService.calculateMatch(fullStackJd, partialCandidate);
  assert(
    res2.matchPercentage >= 50 && res2.matchPercentage <= 64,
    'Partial Match Candidate (Missing Spring Boot & Docker/AWS)',
    `Calculated Score: ${res2.matchPercentage}% (Must NOT be 90-100%. Missing: ${res2.missingRequiredKeywords.join(', ')})`
  );

  // ----------------------------------------------------
  // TEST 3 — Keyword-Heavy Candidate (Skills only, 0 experience details)
  // ----------------------------------------------------
  const keywordHeavyCandidate = {
    user: { name: 'Keyword Spammer', email: 'spam@test.com' },
    profile: { title: 'Engineer' },
    skills: [
      { name: 'Java' }, { name: 'Spring Boot' }, { name: 'SQL' },
      { name: 'REST API' }, { name: 'Docker' }, { name: 'AWS' }
    ],
    projects: [],
    experiences: []
  };

  const res3 = AtsService.calculateMatch(fullStackJd, keywordHeavyCandidate);
  assert(
    res3.matchPercentage <= 65,
    'Keyword-Heavy Candidate Without Experience Evidence',
    `Calculated Score: ${res3.matchPercentage}% (Penalized due to medium evidence strength and 0 experience)`
  );

  // ----------------------------------------------------
  // TEST 4 — Missing Critical Skill
  // ----------------------------------------------------
  const missingCriticalCandidate = {
    user: { name: 'No Java Engineer', email: 'nojava@test.com' },
    profile: { title: 'Frontend Dev' },
    skills: [{ name: 'React' }, { name: 'Tailwind CSS' }, { name: 'Git' }],
    projects: [{ title: 'React App', description: 'Built React UI', technologies: ['React'] }],
    experiences: [{ role: 'Frontend Dev', startDate: '2023-01-01', current: true }]
  };

  const res4 = AtsService.calculateMatch(fullStackJd, missingCriticalCandidate);
  assert(
    res4.matchPercentage <= 40 && res4.missingRequiredKeywords.includes('Java'),
    'Missing Critical Skill Penalty',
    `Calculated Score: ${res4.matchPercentage}% (Correctly flagged missing Java & Spring Boot)`
  );

  // ----------------------------------------------------
  // TEST 5 — Fresher vs Senior JD
  // ----------------------------------------------------
  const internCandidate = {
    user: { name: 'Student Intern', email: 'intern@test.com' },
    profile: { title: 'CS Student' },
    skills: [{ name: 'Java' }, { name: 'Spring Boot' }, { name: 'SQL' }, { name: 'REST API' }],
    experiences: [
      { role: 'Summer Intern', startDate: '2024-06-01', endDate: '2024-09-01', description: 'Assisted with Java REST APIs' }
    ]
  };

  const res5 = AtsService.calculateMatch(fullStackJd, internCandidate);
  assert(
    res5.scoreBreakdown?.experience.status === 'Seniority Mismatch' && res5.matchPercentage <= 68,
    'Fresher Applying for Senior 5+ Years Role',
    `Calculated Score: ${res5.matchPercentage}%, Status: ${res5.scoreBreakdown?.experience.status}`
  );

  // ----------------------------------------------------
  // TEST 6 — Java Boundary (JavaScript != Java)
  // ----------------------------------------------------
  const jsCandidate = {
    user: { name: 'JS Developer', email: 'js@test.com' },
    profile: { title: 'JavaScript Developer', bio: 'Building applications with JavaScript and Node.js.' },
    skills: [{ name: 'JavaScript' }, { name: 'Node.js' }],
    projects: [{ title: 'JS App', description: 'Created fullstack JavaScript app with Node.js', technologies: ['JavaScript', 'Node.js'] }],
    experiences: [{ role: 'JS Engineer', description: 'Worked with JavaScript and Express', startDate: '2023-01-01', current: true }]
  };

  const javaOnlyJd = 'Requirements: Java, Spring Boot, SQL';
  const res6 = AtsService.calculateMatch(javaOnlyJd, jsCandidate);
  assert(
    res6.missingRequiredKeywords.includes('Java') && !res6.matchedKeywords.includes('Java'),
    'Java vs JavaScript Boundary Protection (No False Match)',
    `Matched Keywords: [${res6.matchedKeywords.join(', ')}]. Missing: [${res6.missingRequiredKeywords.join(', ')}]`
  );

  // ----------------------------------------------------
  // TEST 7 — No JD Behavior
  // ----------------------------------------------------
  const res7 = AtsService.calculateMatch('', strongCandidate);
  assert(
    res7.hasJobDescription === false && res7.resumeHealthScore! >= 80 && res7.message.includes('Add a Job Description'),
    'No-JD Behavior (Resume Health Score)',
    `hasJobDescription: ${res7.hasJobDescription}, ResumeHealthScore: ${res7.resumeHealthScore}/100, Message: "${res7.message}"`
  );

  console.log('\n==================================================');
  console.log(`📊 TEST RESULTS: ${passed} / ${total} PASSED`);
  console.log('==================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAtsTests();
