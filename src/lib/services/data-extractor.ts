import { ExtractedContact, ExtractedSkill, ExtractedExperience, ExtractedEducation, ResumeData } from '@/lib/types';

// ─── Regex Patterns ───
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.]+/gi;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/gi;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/gi;
const URL_REGEX = /https?:\/\/(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:\/[\w-./?%&=]*)?/gi;

// ─── Skill Keywords ───
const SKILL_CATEGORIES: Record<string, string[]> = {
  language: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'perl', 'dart', 'lua',
    'haskell', 'elixir', 'clojure', 'objective-c', 'assembly', 'sql', 'html', 'css',
    'sass', 'less', 'bash', 'shell', 'powershell',
  ],
  framework: [
    'react', 'reactjs', 'react.js', 'next.js', 'nextjs', 'angular', 'angularjs', 'vue',
    'vuejs', 'vue.js', 'svelte', 'nuxt', 'nuxtjs', 'express', 'expressjs', 'express.js',
    'nestjs', 'nest.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
    'ruby on rails', 'rails', 'laravel', 'asp.net', '.net', 'dotnet', 'flutter',
    'react native', 'electron', 'gatsby', 'remix', 'tailwind', 'tailwindcss',
    'bootstrap', 'material ui', 'chakra ui', 'jquery', 'redux', 'mobx', 'zustand',
    'graphql', 'rest', 'restful', 'grpc', 'socket.io', 'webpack', 'vite',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
    'node.js', 'nodejs', 'node', 'deno', 'bun',
  ],
  tool: [
    'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'k8s',
    'jenkins', 'ci/cd', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant',
    'nginx', 'apache', 'linux', 'unix', 'windows server', 'jira', 'confluence',
    'slack', 'trello', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
    'postman', 'swagger', 'visual studio', 'vs code', 'intellij', 'eclipse',
    'xcode', 'android studio', 'jupyter', 'anaconda', 'npm', 'yarn', 'pnpm',
    'maven', 'gradle', 'pip', 'conda', 'homebrew', 'vercel', 'netlify', 'heroku',
    'agile', 'scrum', 'kanban', 'devops', 'microservices',
  ],
  database: [
    'postgresql', 'postgres', 'mysql', 'mariadb', 'mongodb', 'redis', 'elasticsearch',
    'cassandra', 'dynamodb', 'firebase', 'firestore', 'supabase', 'sqlite', 'oracle',
    'sql server', 'mssql', 'neo4j', 'couchdb', 'influxdb', 'prisma', 'sequelize',
    'typeorm', 'mongoose', 'knex', 'drizzle',
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'digitalocean',
    'cloudflare', 's3', 'ec2', 'lambda', 'ecs', 'eks', 'rds', 'cloudfront',
    'route 53', 'sqs', 'sns', 'kinesis', 'sagemaker', 'cloud functions',
    'app engine', 'compute engine', 'cloud run', 'bigquery',
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving',
    'problem-solving', 'critical thinking', 'analytical', 'time management',
    'project management', 'mentoring', 'coaching', 'presentation', 'public speaking',
    'negotiation', 'conflict resolution', 'adaptability', 'creativity', 'innovation',
    'decision making', 'strategic thinking', 'emotional intelligence',
  ],
};

// ─── Section Detection Keywords ───
const EXPERIENCE_HEADERS = [
  'experience', 'work experience', 'professional experience', 'employment',
  'work history', 'career history', 'professional background',
];

const EDUCATION_HEADERS = [
  'education', 'academic', 'qualifications', 'degrees', 'certifications',
  'academic background', 'educational background',
];

export function extractContactInfo(text: string): ExtractedContact {
  const emails = text.match(EMAIL_REGEX);
  const phones = text.match(PHONE_REGEX);
  const linkedinUrls = text.match(LINKEDIN_REGEX);
  const githubUrls = text.match(GITHUB_REGEX);

  // Extract all URLs
  const allUrls = Array.from(new Set(text.match(URL_REGEX) || []));
  const excludedDomains = ['linkedin.com', 'github.com'];
  const otherUrls = allUrls.filter((url) => {
    const lowerUrl = url.toLowerCase();
    return !excludedDomains.some((domain) => lowerUrl.includes(domain));
  });

  const portfolioUrl = otherUrls.length > 0 ? otherUrls[0] : null;

  // Extract name: heuristic - first non-empty line that looks like a name
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  let name: string | null = null;

  for (const line of lines.slice(0, 5)) {
    // A name line is typically short, contains mostly letters, and no special patterns
    const cleanLine = line.replace(/[^\w\s.-]/g, '').trim();
    if (
      cleanLine.length > 1 &&
      cleanLine.length < 60 &&
      !cleanLine.includes('@') &&
      !cleanLine.match(/^\d/) &&
      !cleanLine.toLowerCase().match(/^(resume|curriculum|cv|objective|summary|profile)/) &&
      cleanLine.split(/\s+/).length >= 2 &&
      cleanLine.split(/\s+/).length <= 5
    ) {
      name = cleanLine;
      break;
    }
  }

  return {
    name,
    email: emails?.[0] || null,
    phone: phones?.[0] || null,
    linkedinUrl: linkedinUrls?.[0] || null,
    githubUrl: githubUrls?.[0] || null,
    portfolioUrl,
    externalLinks: otherUrls,
  };
}

export function extractSkills(text: string): ExtractedSkill[] {
  const foundSkills: ExtractedSkill[] = [];
  const textLower = text.toLowerCase();
  const seenSkills = new Set<string>();

  for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    for (const keyword of keywords) {
      // Word boundary matching
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(textLower) && !seenSkills.has(keyword.toLowerCase())) {
        seenSkills.add(keyword.toLowerCase());
        foundSkills.push({
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          category: category as ExtractedSkill['category'],
        });
      }
    }
  }

  return foundSkills;
}

export function extractExperiences(text: string): ExtractedExperience[] {
  const experiences: ExtractedExperience[] = [];
  const lines = text.split('\n').map((l) => l.trim());

  // Find experience section
  let expStartIdx = -1;
  let expEndIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (EXPERIENCE_HEADERS.some((h) => lineLower.includes(h)) && expStartIdx === -1) {
      expStartIdx = i + 1;
    } else if (expStartIdx !== -1 && EDUCATION_HEADERS.some((h) => lineLower.includes(h))) {
      expEndIdx = i;
      break;
    }
  }

  if (expStartIdx === -1) return experiences;

  // Simple extraction: look for patterns like "Title at Company" or "Title | Company"
  const expLines = lines.slice(expStartIdx, expEndIdx).filter((l) => l.length > 0);
  let currentExp: ExtractedExperience | null = null;

  for (const line of expLines) {
    // Date pattern detection
    const datePattern = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)[\s,]*\d{2,4}\s*[-–—to]+\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?[\s,]*\d{0,4}|(?:present|current|\d{4}\s*[-–—to]+\s*\d{4}|\d{4}\s*[-–—to]+\s*(?:present|current))/i;

    const hasDate = datePattern.test(line);
    const isTitleLine =
      line.length < 100 &&
      (line.includes('|') || line.includes(' at ') || line.includes(' - ') || hasDate);

    if (isTitleLine && line.length > 3) {
      if (currentExp) experiences.push(currentExp);
      const parts = line.split(/[|–—]/).map((p) => p.trim());
      currentExp = {
        title: parts[0] || null,
        company: parts[1] || null,
        duration: line.match(datePattern)?.[0] || null,
        description: '',
      };
    } else if (currentExp && line.length > 10) {
      currentExp.description = currentExp.description
        ? `${currentExp.description}\n${line}`
        : line;
    }
  }

  if (currentExp) experiences.push(currentExp);
  return experiences.slice(0, 10); // Limit to 10 entries
}

export function extractEducation(text: string): ExtractedEducation[] {
  const educations: ExtractedEducation[] = [];
  const lines = text.split('\n').map((l) => l.trim());

  let eduStartIdx = -1;
  let eduEndIdx = lines.length;

  const postEduHeaders = ['skills', 'projects', 'certifications', 'awards', 'interests', 'hobbies', 'references'];

  for (let i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (EDUCATION_HEADERS.some((h) => lineLower.includes(h)) && eduStartIdx === -1) {
      eduStartIdx = i + 1;
    } else if (eduStartIdx !== -1 && postEduHeaders.some((h) => lineLower.includes(h))) {
      eduEndIdx = i;
      break;
    }
  }

  if (eduStartIdx === -1) return educations;

  const eduLines = lines.slice(eduStartIdx, eduEndIdx).filter((l) => l.length > 0);

  const degreePatterns = [
    /\b(?:b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|ph\.?d\.?|m\.?b\.?a\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech|bachelor|master|doctor|associate|diploma)\b/i,
  ];

  let currentEdu: ExtractedEducation | null = null;

  for (const line of eduLines) {
    const hasDegree = degreePatterns.some((p) => p.test(line));
    const yearMatch = line.match(/\b(19|20)\d{2}\b/g);

    if (hasDegree || (line.length < 120 && line.length > 5 && yearMatch)) {
      if (currentEdu) educations.push(currentEdu);
      currentEdu = {
        degree: hasDegree ? line.split(/[,|–—]/)[0].trim() : null,
        institution: hasDegree ? (line.split(/[,|–—]/)[1]?.trim() || null) : line,
        year: yearMatch ? yearMatch[yearMatch.length - 1] : null,
      };
    } else if (currentEdu && !currentEdu.institution && line.length > 3) {
      currentEdu.institution = line;
    }
  }

  if (currentEdu) educations.push(currentEdu);
  return educations.slice(0, 5);
}

export function extractResumeData(text: string): ResumeData {
  return {
    contact: extractContactInfo(text),
    skills: extractSkills(text),
    experiences: extractExperiences(text),
    educations: extractEducation(text),
    rawText: text,
  };
}
