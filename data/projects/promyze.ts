import { Project, ProjectStatus } from "@/types";

const title = "Promyze Features";

const abstract = "Enhanced Git hosting platform with new roles, icons, and AI-powered modification recommendations for improved code review and collaboration.";

const description = `At Promyze (now Packmind), I contributed to improving the Git integration with their platform by developing new features and integrating AI capabilities.
First of all, I implemented a new role system, defining if the user is one to take initiatives or not.
Then, I added full integration of the platform with Git hosts, such as GitHub, GitLab, Bitbucket, and Azure DevOps.
This included implementing hashed authentication tokens, to avoid exposing the Git credentials in the code.
Finally, I created an algorithm to suggest modifications to the Git history, to make it easier to review the code for team members.
In the end, through this algorithm, I implemented links to LLM to enhance the recommendations, further improving the code review process.`;

const technologies = [
  "TypeScript",
  "React",
  "AngularJS",
  "Git API",
  "Chat GPT APIs"
];

const highlights = [
  "Developed new roles for the platform, defining if the user is one to take initiatives or not",
  "Integrated with Git hosts like GitHub, GitLab, Bitbucket, and Azure DevOps",
  "Created algorithms for Git history modification recommendations",
  "Implemented AI-powered features using Chat GPT APIs",
  "Utilized web technologies including TypeScript, React, and AngularJS"
];

const internship = {
  company: "Promyze (now Packmind)",
  location: "Bordeaux, France",
  companyUrl: "https://www.packmind.com"
};

export const promyze: Project = {
  id: "promyze-2023",
  title,
  abstract,
  description,
  technologies,
  date: "June 2023",
  thumbnail: "/thumbnails/promyze.webp",
  highlights,
  role: "Software Intern",
  status: ProjectStatus.COMPLETED,
  duration: "2 months",
  internship
}; 