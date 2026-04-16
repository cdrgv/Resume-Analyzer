// NLP Service - Extracts skills, sections, and keywords from resume text

const SKILL_KEYWORDS = {
  webDev: ['html', 'css', 'javascript', 'react', 'angular', 'vue', 'nodejs', 'node.js', 'express', 'nextjs', 'next.js', 'typescript', 'sass', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'redux', 'graphql', 'rest api', 'restful'],
  dataSci: ['python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'keras', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'data analysis', 'nlp', 'computer vision', 'statistics', 'jupyter'],
  mobile: ['android', 'ios', 'react native', 'flutter', 'kotlin', 'swift', 'java', 'xamarin', 'mobile development', 'dart'],
  database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'oracle', 'nosql', 'sqlite', 'dynamodb'],
  devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'git', 'github', 'gitlab', 'linux', 'bash', 'terraform', 'ansible'],
  general: ['c', 'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'scala', 'spring', 'django', 'flask', 'laravel', 'agile', 'scrum', 'jira', 'figma', 'photoshop']
};

const ALL_SKILLS = Object.values(SKILL_KEYWORDS).flat();

const DOMAIN_WEIGHTS = {
  'Web Development': SKILL_KEYWORDS.webDev,
  'Data Science / ML': SKILL_KEYWORDS.dataSci,
  'Mobile Development': SKILL_KEYWORDS.mobile,
  'Database / Backend': SKILL_KEYWORDS.database,
  'DevOps / Cloud': SKILL_KEYWORDS.devops,
  'General Software': SKILL_KEYWORDS.general
};

const JOB_ROLES = {
  'Web Development': ['Frontend Developer', 'Full Stack Developer', 'React Developer', 'UI Engineer'],
  'Data Science / ML': ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Engineer'],
  'Mobile Development': ['Android Developer', 'iOS Developer', 'React Native Developer', 'Mobile Engineer'],
  'Database / Backend': ['Backend Developer', 'Database Administrator', 'API Developer'],
  'DevOps / Cloud': ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
  'General Software': ['Software Engineer', 'Full Stack Developer', 'Software Developer']
};

const cleanText = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s.+#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractSkills = (text) => {
  const cleaned = cleanText(text);
  const found = [];
  ALL_SKILLS.forEach(skill => {
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(cleaned)) {
      // Title-case the skill for display
      found.push(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  });
  return [...new Set(found)];
};

const detectDomain = (skills) => {
  const lowerSkills = skills.map(s => s.toLowerCase());
  let maxScore = 0;
  let detectedDomain = 'General Software';

  Object.entries(DOMAIN_WEIGHTS).forEach(([domain, domainSkills]) => {
    const score = domainSkills.filter(ds => lowerSkills.includes(ds.toLowerCase())).length;
    if (score > maxScore) {
      maxScore = score;
      detectedDomain = domain;
    }
  });
  return detectedDomain;
};

const getMissingSkills = (domain, foundSkills) => {
  const lowerFound = foundSkills.map(s => s.toLowerCase());
  const domainSkills = DOMAIN_WEIGHTS[domain] || [];
  const missing = domainSkills
    .filter(s => !lowerFound.includes(s.toLowerCase()))
    .slice(0, 8)
    .map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  return missing;
};

const checkSection = (text, keywords) => {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
};

const extractExperience = (text) => {
  const lower = text.toLowerCase();
  const yearPatterns = [
    /(\d+)\s*(?:\+?\s*)?years?\s*(?:of\s*)?experience/i,
    /experience\s*(?:of\s*)?(\d+)\s*(?:\+?\s*)?years?/i,
    /(\d+)\s*years?/i
  ];

  let years = 0;
  for (const pattern of yearPatterns) {
    const match = lower.match(pattern);
    if (match) {
      years = Math.max(years, parseInt(match[1]));
    }
  }

  // If no years found, check for keywords
  if (years === 0) {
    if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal')) {
      years = 5; // Assume senior level
    } else if (lower.includes('mid') || lower.includes('intermediate')) {
      years = 3;
    } else if (lower.includes('junior') || lower.includes('entry') || lower.includes('fresher')) {
      years = 1;
    } else if (hasExperience) {
      years = 2; // Default if experience section exists
    }
  }

  let level = 'Entry Level';
  if (years >= 5) level = 'Senior';
  else if (years >= 3) level = 'Mid Level';
  else if (years >= 1) level = 'Junior';

  return { years, level };
};

const analyzeResume = (text) => {
  const lower = text.toLowerCase();

  const skills = extractSkills(text);
  const domain = detectDomain(skills);
  const missingSkills = getMissingSkills(domain, skills);
  const jobRoles = JOB_ROLES[domain] || JOB_ROLES['General Software'];

  // Section detection
  const hasExperience = checkSection(text, ['experience', 'work history', 'employment', 'internship', 'intern']);
  const hasProjects = checkSection(text, ['project', 'projects', 'built', 'developed', 'created']);
  const hasEducation = checkSection(text, ['education', 'university', 'college', 'b.tech', 'btech', 'b.e', 'degree', 'bachelor', 'master']);
  const hasObjective = checkSection(text, ['objective', 'summary', 'profile', 'about']);

  // Extract experience details
  const experience = extractExperience(text);

  // Score calculation
  const skillScore = Math.min(30, Math.round((skills.length / 10) * 30));
  const projectScore = hasProjects ? 20 + (lower.includes('github') ? 5 : 0) : 0;
  const expScore = hasExperience ? Math.min(20, 5 + experience.years * 2) : 0;
  const eduScore = hasEducation ? 10 : 0;
  const keywordScore = Math.min(15, skills.length > 5 ? 15 : skills.length * 2);

  const totalScore = Math.min(100, skillScore + projectScore + expScore + eduScore + keywordScore);

  // Generate suggestions
  const suggestions = [];
  if (skills.length < 5) suggestions.push('Add more technical skills relevant to your target role');
  if (!hasProjects) suggestions.push('Include a Projects section with descriptions and GitHub links');
  if (!hasExperience) suggestions.push('Add internship or work experience (even freelance counts)');
  if (!hasEducation) suggestions.push('Include your educational qualifications');
  if (!hasObjective) suggestions.push('Add a professional summary/objective at the top');
  if (!lower.includes('github')) suggestions.push('Include your GitHub profile link');
  if (!lower.includes('linkedin')) suggestions.push('Add your LinkedIn profile URL');
  if (missingSkills.length > 3) suggestions.push(`Consider learning: ${missingSkills.slice(0, 3).join(', ')}`);
  if (text.length < 500) suggestions.push('Your resume seems short — add more detail about your work and projects');
  if (suggestions.length === 0) suggestions.push('Great resume! Keep it updated with new projects and skills');

  return {
    score: totalScore,
    breakdown: {
      skills: skillScore,
      projects: projectScore,
      experience: expScore,
      education: eduScore,
      keywords: keywordScore
    },
    domain,
    extractedSkills: skills,
    missingSkills,
    suggestions,
    jobRoles,
    experience
  };
};

module.exports = { analyzeResume };
