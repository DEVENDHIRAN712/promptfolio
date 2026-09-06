export type PortfolioThemeType = 'Apple' | 'Glass' | 'Minimal' | 'Cyberpunk' | 'Developer Terminal' | 'Modern SaaS' | 'Neo Brutalist' | 'Aurora Prism' | 'Creative Studio' | 'Architect Grid';

export interface IUserData {
  _id: string;
  name: string;
  email: string;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

export interface IProfileData {
  _id: string;
  userId: string;
  username?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  socialLinks?: ISocialLinks;
  completionPercentage?: number;
  theme?: PortfolioThemeType;
  isPublished?: boolean;
}

export interface IExperienceData {
  _id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  technologies?: string[];
}

export interface IEducationData {
  _id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
}

export interface ISkillData {
  _id: string;
  name: string;
  category?: 'Frontend' | 'Backend' | 'AI / ML' | 'DevOps / Cloud' | 'Database' | 'Other';
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface IProjectData {
  _id: string;
  title: string;
  description?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  stars?: number;
  forks?: number;
}

export interface ICertificateData {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface IResumeData {
  _id: string;
  fileName?: string;
  originalName?: string;
  fileUrl?: string;
  parsedData?: any;
}

export interface IPublicPortfolioData {
  user: IUserData;
  profile: IProfileData;
  experiences: IExperienceData[];
  educations: IEducationData[];
  skills: ISkillData[];
  projects: IProjectData[];
  certificates: ICertificateData[];
  githubConnection?: any;
  latestResume?: IResumeData;
}

export interface IThemeProps {
  data: IPublicPortfolioData;
  theme: PortfolioThemeType;
  onThemeChange?: (newTheme: PortfolioThemeType) => void;
}
