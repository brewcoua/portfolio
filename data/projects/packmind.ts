import { Project, ProjectStatus } from "@/types";

const title = "Packmind Features";

const abstract = "Enhanced Git hosting platform with new roles, icons, and AI-powered modification recommendations for improved code review and collaboration.";

const description = `At Packmind (prev. Promyze), I contributed to improving their Git hosting platform by developing new features and integrating AI capabilities. The project involved working with modern web technologies and implementing AI-driven recommendations.`;

const technologies = [
  "TypeScript",
  "React",
  "AngularJS",
  "Git API",
  "Chat GPT APIs"
];

const highlights = [
  "Developed new roles and icons for Git hosting platform",
  "Integrated with Git hosts like GitHub",
  "Created algorithms for Git history modification recommendations",
  "Implemented AI-powered features using Chat GPT APIs",
  "Utilized web technologies including TypeScript, React, and AngularJS"
];

const internship = {
  company: "Packmind",
  location: "Bordeaux, France",
  companyUrl: "https://www.packmind.com"
};

export const packmind: Project = {
  id: "packmind-2023",
  title,
  abstract,
  description,
  technologies,
  date: "June 2023",
  featured: true,
  highlights,
  role: "Software Development",
  status: ProjectStatus.COMPLETED,
  duration: "3 months",
  internship
}; 