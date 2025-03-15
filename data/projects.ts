import { ProjectStatus, ProjectsData } from "@/types";

const projectsData: ProjectsData = {
  projects: [
    {
      id: "V1StGXR8_Z5jdHi6B-myT",
      title: "Portfolio Website",
      description: "A modern portfolio website built with Next.js and Tailwind CSS, featuring dynamic project loading and responsive design.",
      longDescription: "This portfolio website showcases my projects and skills using modern web technologies. It features a responsive design, dark mode support, and dynamic content loading. The site is built with accessibility and performance in mind, utilizing Next.js 14's app router and server components for optimal loading speeds.",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      thumbnail: "/thumbnails/V1StGXR8_Z5jdHi6B-myT.png",
      githubUrl: "https://github.com/yourusername/portfolio",
      liveUrl: "https://your-portfolio.com",
      date: "2024-03",
      featured: true,
      highlights: [
        "Implemented responsive design with Tailwind CSS",
        "Added dark mode support using next-themes",
        "Built with accessibility in mind using semantic HTML and ARIA attributes",
        "Optimized performance with Next.js Image component and dynamic imports"
      ],
      role: "Solo Developer",
      status: ProjectStatus.COMPLETED,
      duration: "2 months"
    },
    {
      id: "7oE6LZ2d-mNcRf9_X4wYp",
      title: "Task Management App",
      description: "A full-stack task management application with real-time updates and collaborative features.",
      longDescription: "A comprehensive task management solution that allows teams to collaborate in real-time. Features include task creation, assignment, status tracking, and real-time notifications. The application uses WebSocket for live updates and implements a responsive, intuitive interface for both desktop and mobile users.",
      technologies: ["React", "Node.js", "MongoDB", "WebSocket", "Express", "Redux"],
      githubUrl: "https://github.com/yourusername/task-manager",
      liveUrl: "https://your-taskmanager.com",
      date: "2024-02",
      featured: false,
      highlights: [
        "Implemented real-time updates using WebSocket",
        "Designed and built RESTful API with Node.js and Express",
        "Created responsive UI with Material-UI components",
        "Implemented user authentication and authorization"
      ],
      role: "Full Stack Developer",
      status: ProjectStatus.IN_PROGRESS,
      duration: "3 months",
      teamSize: "3 developers"
    }
  ]
};

export default projectsData; 