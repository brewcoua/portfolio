export interface ResumeData {
  personal: {
    name: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    github: string;
    linkedin: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    details?: string[];
    exchanges?: Array<{
      institution: string;
      program?: string;
      location: string;
      startDate: string;
      endDate: string;
      gpa?: string;
      details?: string[];
    }>;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    link: string;
    technologies: string[];
    highlights: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    score: string;
    year: string;
  }>;
}


