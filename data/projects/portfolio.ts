import { Project, ProjectStatus } from "@/types";

const title = "Personal Portfolio";

const abstract = "A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features project showcases, resume display, and dark/light mode support with a clean, accessible UI.";

const description = `This portfolio website showcases my projects and skills using modern web technologies. Built with a focus on performance, accessibility, and user experience, it implements several key features:

1. **Modern Tech Stack**
   - Next.js 15 with App Router for optimized routing and server components
   - TypeScript for type safety and improved developer experience
   - Tailwind CSS for responsive, utility-first styling
   - Shadcn UI components for consistent design language

2. **Project Showcase**
   - Dynamic project pages with markdown support
   - Syntax highlighting for code snippets
   - Academic reference linking system
   - Responsive image galleries with lightbox functionality

3. **User Experience**
   - Dark/light mode with system preference detection
   - Responsive design for all device sizes
   - Optimized performance with Next.js image optimization
   - Accessible UI following WCAG guidelines

The site features a clean, minimalist design that puts content first while maintaining visual appeal. The project system allows for easy addition of new work through structured TypeScript files, with support for rich markdown content including code blocks, lists, and academic references.

Implementation highlights include custom components for rendering markdown content, a responsive navigation system, and optimized image loading for improved performance. The codebase is structured for maintainability and future expansion.

This project demonstrates practical application of modern frontend development practices [[1]](#ref-1) while maintaining a focus on performance and accessibility standards [[2]](#ref-2).`;

const technologies = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "React",
  "Shadcn UI",
  "Markdown",
  "Responsive Design"
];

const highlights = [
  "Implemented responsive design with Tailwind CSS",
  "Created dynamic project pages with markdown support",
  "Built custom academic reference system",
  "Integrated dark/light mode with system preference detection",
  "Optimized for performance and accessibility",
  "Designed clean, minimalist UI with Shadcn components"
];

export const portfolio: Project = {
  id: "portfolio-2024",
  title,
  abstract,
  description,
  technologies,
  thumbnail: "/thumbnails/portfolio.png",
  githubUrl: "https://github.com/brewcoua/portfolio",
  liveUrl: "https://brewen.dev",
  date: "March 2025",
  highlights,
  role: "Full-stack Developer",
  status: ProjectStatus.COMPLETED,
  duration: "1 week"
}; 