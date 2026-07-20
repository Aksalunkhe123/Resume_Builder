const ROLE_REQUIREMENTS = {
  'Java Developer': {
    requiredSkills: [
      'Java',
      'Spring Boot',
      'Spring',
      'Hibernate',
      'Maven',
      'REST API',
      'SQL',
      'MySQL',
      'PostgreSQL',
      'Git',
      'OOP',
      'JUnit',
      'Microservices',
      'Docker',
      'Linux',
      'Agile',
    ],
    recommendedSkills: ['Kafka', 'Redis', 'Kubernetes', 'AWS', 'Gradle', 'Mockito', 'CI/CD'],
  },
  'Full Stack Developer': {
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Express',
      'HTML',
      'CSS',
      'MongoDB',
      'SQL',
      'REST API',
      'Git',
      'Redux',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Responsive Design',
    ],
    recommendedSkills: ['Next.js', 'GraphQL', 'Tailwind CSS', 'CI/CD', 'Jest', 'Webpack', 'Firebase'],
  },
  'Data Analyst': {
    requiredSkills: [
      'Python',
      'SQL',
      'Excel',
      'Tableau',
      'Power BI',
      'Pandas',
      'NumPy',
      'Data Visualization',
      'Statistics',
      'Data Cleaning',
      'ETL',
      'MySQL',
      'PostgreSQL',
      'Jupyter',
      'R',
    ],
    recommendedSkills: ['Machine Learning', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Spark', 'Looker', 'Google Analytics'],
  },
  'Software Engineer': {
    requiredSkills: [
      'Data Structures',
      'Algorithms',
      'Java',
      'Python',
      'JavaScript',
      'Git',
      'SQL',
      'OOP',
      'System Design',
      'REST API',
      'Agile',
      'CI/CD',
      'Testing',
      'Linux',
      'Problem Solving',
      'Cloud',
    ],
    recommendedSkills: ['Docker', 'Kubernetes', 'AWS', 'Microservices', 'Design Patterns', 'TDD', 'Code Review'],
  },
};

const SUPPORTED_ROLES = Object.keys(ROLE_REQUIREMENTS);

const normalizeSkill = (skill) => skill.toLowerCase().trim().replace(/[^a-z0-9+#.\s-]/g, '');

const SKILL_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  'node': 'node.js',
  'nodejs': 'node.js',
  'react.js': 'react',
  'reactjs': 'react',
  'vue.js': 'vue',
  'springboot': 'spring boot',
  'powerbi': 'power bi',
  'rest': 'rest api',
  'restful': 'rest api',
  'oop': 'oop',
  'object oriented': 'oop',
  'ds': 'data structures',
  'algo': 'algorithms',
  'ml': 'machine learning',
  'aws cloud': 'aws',
  'amazon web services': 'aws',
  'gcp': 'cloud',
  'azure': 'cloud',
};

const expandSkill = (skill) => {
  const normalized = normalizeSkill(skill);
  return SKILL_ALIASES[normalized] || normalized;
};

const skillsMatch = (resumeSkill, requiredSkill) => {
  const r = expandSkill(resumeSkill);
  const q = expandSkill(requiredSkill);

  if (r === q) return true;
  if (r.includes(q) || q.includes(r)) return true;

  const rTokens = r.split(/[\s/,-]+/).filter(Boolean);
  const qTokens = q.split(/[\s/,-]+/).filter(Boolean);

  return qTokens.every((qt) => rTokens.some((rt) => rt === qt || rt.includes(qt) || qt.includes(rt)));
};

const IMPROVEMENT_TEMPLATES = {
  default: (skill) => `Learn ${skill} through online courses and build a small project to demonstrate proficiency.`,
  'Spring Boot': () => 'Build a REST API project using Spring Boot with JPA and deploy it to showcase backend skills.',
  React: () => 'Create a portfolio project with React including state management and API integration.',
  Python: () => 'Practice Python for data manipulation and automation with real datasets on Kaggle.',
  SQL: () => 'Solve SQL problems on HackerRank or LeetCode and practice complex joins and aggregations.',
  'System Design': () => 'Study system design fundamentals and practice designing scalable architectures.',
  Docker: () => 'Containerize one of your projects with Docker and learn docker-compose for multi-service apps.',
  AWS: () => 'Complete AWS Cloud Practitioner or Solutions Architect basics and deploy a project on AWS.',
};

const getImprovementSuggestion = (skill) => {
  const template = IMPROVEMENT_TEMPLATES[skill] || IMPROVEMENT_TEMPLATES.default;
  return typeof template === 'function' ? template(skill) : template;
};

const computeSkillGap = (resumeSkills, targetRole) => {
  const roleData = ROLE_REQUIREMENTS[targetRole];
  if (!roleData) {
    throw new Error(`Unsupported role. Choose from: ${SUPPORTED_ROLES.join(', ')}`);
  }

  const { requiredSkills, recommendedSkills } = roleData;
  const existingSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((required) => {
    const found = resumeSkills.some((resumeSkill) => skillsMatch(resumeSkill, required));
    if (found) {
      existingSkills.push(required);
    } else {
      missingSkills.push(required);
    }
  });

  const allRecommended = [...new Set([...missingSkills.slice(0, 5), ...recommendedSkills])];
  const recommended = allRecommended
    .filter((skill) => !existingSkills.some((existing) => skillsMatch(existing, skill)))
    .slice(0, 8);

  const matchPercentage = Math.round((existingSkills.length / requiredSkills.length) * 100);

  const improvementSuggestions = missingSkills.slice(0, 6).map((skill) => ({
    skill,
    suggestion: getImprovementSuggestion(skill),
  }));

  return {
    targetRole,
    matchPercentage,
    totalRequired: requiredSkills.length,
    existingSkills,
    missingSkills,
    recommendedSkills: recommended,
    improvementSuggestions,
  };
};

module.exports = { ROLE_REQUIREMENTS, SUPPORTED_ROLES, computeSkillGap };
