import AtsService from './ats.service';

function runStrictAtsV2Tests() {
  console.log('==================================================');
  console.log('🧪 RUNNING STRICT TOP-MNC ATS V2 UNIT TESTS');
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
  // REALISTIC TEST 1 — Senior Java Backend Developer vs Node/React Fresher
  // ----------------------------------------------------
  const fresherNodeReactCandidate = {
    user: { name: 'Fresher Node Dev', email: 'fresher@test.com' },
    profile: { title: 'Junior Web Developer', bio: 'Recent CS graduate building web applications with Node.js and React.' },
    skills: [{ name: 'Java' }, { name: 'JavaScript' }, { name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }, { name: 'HTML5' }, { name: 'CSS3' }],
    projects: [
      {
        title: 'React Node E-Commerce',
        description: 'Built frontend UI using React and Tailwind CSS. Developed REST APIs using Node.js and Express with MongoDB database.',
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript']
      }
    ],
    experiences: [],
    educations: [{ degree: 'B.E.', fieldOfStudy: 'Computer Science', institution: 'Tech Institute' }]
  };

  const seniorJavaJd = `
    Job Title: Senior Java Backend Developer
    Experience: 5+ years of professional backend engineering experience required
    Requirements:
    - Must have strong expertise in Java and Spring Boot framework
    - Extensive experience building REST APIs and Microservices
    - Deep knowledge of SQL databases (PostgreSQL/MySQL)
    - Strong experience with Kafka messaging queues
    Nice to Have:
    - Docker containerization and AWS cloud infrastructure deployment
    - Bachelor's degree in Computer Science
  `;

  const res1 = AtsService.calculateMatch(seniorJavaJd, fresherNodeReactCandidate);
  assert(
    res1.matchPercentage <= 38,
    'Realistic Test 1: Senior Java Backend JD vs Node/React Fresher Candidate',
    `Calculated Score: ${res1.matchPercentage}% (Expected LOW <= 38%. Missing: Spring Boot, Microservices, SQL, Kafka, Docker, AWS, 5+ yrs exp, Seniority/Domain Mismatch)`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 2 — Full Stack Developer vs Qualified Intern/Junior
  // ----------------------------------------------------
  const fullstackCandidate = {
    user: { name: 'Fullstack Junior', email: 'junior@test.com' },
    profile: { title: 'Full Stack Engineer' },
    skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Express.js' }, { name: 'MongoDB' }, { name: 'REST API' }, { name: 'JavaScript' }],
    projects: [
      {
        title: 'Full Stack MERN SaaS Platform',
        description: 'Designed responsive React UI components. Implemented Express.js REST APIs and MongoDB database schemas.',
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'JavaScript']
      }
    ],
    experiences: [
      { role: 'Software Engineer Intern', company: 'SaaS Startup', startDate: '2024-01-01', endDate: '2024-07-01', description: 'Developed React and Node.js REST API features.' }
    ],
    educations: [{ degree: 'B.E.', fieldOfStudy: 'Computer Science' }]
  };

  const fullstackJd = `
    Job Title: Full Stack Developer
    Experience: 1+ year experience
    Requirements:
    - Required: React, Node.js, Express.js, MongoDB, REST APIs, JavaScript
    - Preferred: Docker, AWS
  `;

  const res2 = AtsService.calculateMatch(fullstackJd, fullstackCandidate);
  assert(
    res2.matchPercentage >= 70 && res2.matchPercentage <= 84,
    'Realistic Test 2: Full Stack Developer JD vs Qualified Junior Candidate',
    `Calculated Score: ${res2.matchPercentage}% (Expected Strong 70-84%. All required skills matched, missing preferred Docker & AWS)`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 3 — Python Data Scientist vs Web Dev Candidate
  // ----------------------------------------------------
  const webDevCandidate = {
    user: { name: 'Web Dev Candidate', email: 'webdev@test.com' },
    profile: { title: 'Web Developer' },
    skills: [{ name: 'Java' }, { name: 'Spring Boot' }, { name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }],
    projects: [{ title: 'Java Web App', description: 'Built Java Spring Boot backend with React UI', technologies: ['Java', 'Spring Boot', 'React'] }],
    experiences: [{ role: 'Java Developer', startDate: '2023-01-01', current: true }]
  };

  const dataScientistJd = `
    Job Title: Data Scientist
    Requirements:
    - Must have strong experience in Python programming
    - Required libraries: Pandas, NumPy, Scikit-learn
    - Experience building Machine Learning models
    - Strong SQL database querying experience
  `;

  const res3 = AtsService.calculateMatch(dataScientistJd, webDevCandidate);
  assert(
    res3.matchPercentage <= 25,
    'Realistic Test 3: Python Data Scientist JD vs Web Dev Candidate (Role Mismatch)',
    `Calculated Score: ${res3.matchPercentage}% (Expected VERY LOW <= 25%. 0 required data science skills matched)`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 4 — Frontend React Developer (Missing TypeScript & Next.js)
  // ----------------------------------------------------
  const jsReactCandidate = {
    user: { name: 'JS React Dev', email: 'jsreact@test.com' },
    profile: { title: 'Frontend Developer' },
    skills: [{ name: 'React' }, { name: 'JavaScript' }, { name: 'HTML5' }, { name: 'CSS3' }, { name: 'Node.js' }, { name: 'MongoDB' }],
    projects: [{ title: 'React Web UI', description: 'Created React components with HTML5 and CSS3 styling', technologies: ['React', 'JavaScript', 'HTML5', 'CSS3'] }],
    experiences: [{ role: 'Frontend Engineer', startDate: '2023-06-01', current: true }]
  };

  const modernFrontendJd = `
    Job Title: Frontend React Developer
    Requirements:
    - Expert knowledge of React and TypeScript
    - Strong experience with Next.js framework
    - Solid HTML5 and CSS3 fundamentals
    - Automated unit testing experience (Jest/Cypress)
  `;

  const res4 = AtsService.calculateMatch(modernFrontendJd, jsReactCandidate);
  assert(
    res4.matchPercentage >= 42 && res4.matchPercentage <= 60 && res4.missingRequiredKeywords.includes('TypeScript'),
    'Realistic Test 4: Frontend React Developer (Missing TypeScript & Next.js)',
    `Calculated Score: ${res4.matchPercentage}% (Expected MODERATE 42-60%. JS != TS, missing TypeScript, Next.js, Testing)`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 5 — Senior DevOps Engineer vs MERN Candidate
  // ----------------------------------------------------
  const devopsJd = `
    Job Title: Senior DevOps Engineer
    Experience: 5+ years experience required
    Requirements:
    - AWS cloud platform infrastructure
    - Docker containerization and Kubernetes cluster management
    - Infrastructure as Code using Terraform
    - CI/CD pipeline automation and Linux administration
  `;

  const res5 = AtsService.calculateMatch(devopsJd, fresherNodeReactCandidate);
  assert(
    res5.matchPercentage <= 20,
    'Realistic Test 5: Senior DevOps Engineer JD vs MERN Fresher (Severe Mismatch)',
    `Calculated Score: ${res5.matchPercentage}% (Expected VERY LOW <= 20%. Severe role, technology, and seniority mismatch)`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 6 — Java vs JavaScript Boundary Protection
  // ----------------------------------------------------
  const javaOnlyJd = 'Requirements: Java, Spring Boot, SQL';
  const res6 = AtsService.calculateMatch(javaOnlyJd, jsReactCandidate);
  assert(
    res6.missingRequiredKeywords.includes('Java') && !res6.matchedKeywords.includes('Java'),
    'Java vs JavaScript Boundary Protection (No False Match)',
    `Matched Keywords: [${res6.matchedKeywords.join(', ')}]. Missing: [${res6.missingRequiredKeywords.join(', ')}]`
  );

  // ----------------------------------------------------
  // REALISTIC TEST 7 — No-JD Behavior
  // ----------------------------------------------------
  const res7 = AtsService.calculateMatch('', fullstackCandidate);
  assert(
    res7.hasJobDescription === false && res7.resumeHealthScore! >= 80 && res7.message.includes('Add a Job Description'),
    'No-JD Behavior (Resume Health Score)',
    `hasJobDescription: ${res7.hasJobDescription}, ResumeHealthScore: ${res7.resumeHealthScore}/100, Message: "${res7.message}"`
  );

  console.log('\n==================================================');
  console.log(`📊 STRICT ATS V2 TEST RESULTS: ${passed} / ${total} PASSED`);
  console.log('==================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runStrictAtsV2Tests();
