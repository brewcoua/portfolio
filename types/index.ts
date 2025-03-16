export enum ProjectStatus {
  COMPLETED = "Completed",
  IN_PROGRESS = "In Progress",
  PLANNED = "Planned"
}

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

export const getProjectStatusVariant = (status: ProjectStatus): BadgeVariant => {
  switch (status) {
    case ProjectStatus.COMPLETED:
      return "success";
    case ProjectStatus.IN_PROGRESS:
      return "warning";
    case ProjectStatus.PLANNED:
      return "secondary";
    default:
      return "default";
  }
};

export enum SkillCategory {
  LANGUAGES = "Languages",
  WEB_TECHNOLOGIES = "Web Technologies",
  TOOLS_AND_FRAMEWORKS = "Tools & Frameworks",
  CONCEPTS = "Concepts",
  LANGUAGES_SPOKEN = "Languages Spoken"
}

export interface Project {
  id: string;
  title: string;
  abstract: string;  // A brief overview of the project
  description: string;  // Full markdown-supported description
  longDescription?: string;
  technologies: string[];
  thumbnail?: string;
  githubUrl?: string;
  liveUrl?: string;
  date: string;
  featured: boolean;
  highlights?: string[];
  role: string;
  status: ProjectStatus;
  duration: string;
  teamSize?: string;
  sources?: {
    title: string;
    authors?: string[];
    year?: string;
    url?: string;
    doi?: string;
    journal?: string;
    conference?: string;
  }[];
  internship?: {
    company: string;
    location?: string;
    companyUrl?: string;
  };
}

export interface SkillCategoryData {
  category: SkillCategory;
  items: string[];
}

export interface ProjectsData {
  projects: Project[];
}

export interface SkillsData {
  skills: SkillCategoryData[];
} 