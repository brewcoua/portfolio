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
  CONCEPTS = "Concepts"
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  thumbnail?: string;
  githubUrl: string;
  liveUrl?: string;
  date: string;
  featured: boolean;
  highlights?: string[];
  role: string;
  status: ProjectStatus;
  duration: string;
  teamSize?: string;
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