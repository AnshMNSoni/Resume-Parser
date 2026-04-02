export interface ExtractedContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
}

export interface ExtractedExperience {
  title: string | null;
  company: string | null;
  duration: string | null;
  description: string | null;
}

export interface ExtractedEducation {
  degree: string | null;
  institution: string | null;
  year: string | null;
}

export interface ExtractedSkill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'cloud' | 'soft' | 'other';
}

export interface ScoreResult {
  technicalSkills: number;
  codingSkills: number;
  softSkills: number;
  overallJobFit: number;
  technicalFeedback: string;
  codingFeedback: string;
  softSkillsFeedback: string;
  overallFeedback: string;
  extractedSkills: ExtractedSkill[];
}

export interface ResumeData {
  contact: ExtractedContact;
  skills: ExtractedSkill[];
  experiences: ExtractedExperience[];
  educations: ExtractedEducation[];
  rawText: string;
}

export interface CandidateProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  fileName: string;
  rawText: string | null;
  score: {
    technicalSkills: number;
    codingSkills: number;
    softSkills: number;
    overallJobFit: number;
    technicalFeedback: string | null;
    codingFeedback: string | null;
    softSkillsFeedback: string | null;
    overallFeedback: string | null;
  } | null;
  skills: { name: string; category: string }[];
  experiences: ExtractedExperience[];
  educations: ExtractedEducation[];
  createdAt: string;
}

export interface FilterCriteria {
  minTechnical?: number;
  minCoding?: number;
  minSoftSkills?: number;
  minJobFit?: number;
  search?: string;
  batchId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
