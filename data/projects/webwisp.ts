import { Project, ProjectStatus } from "@/types";

const title = "WebWisp";

const abstract = "An autonomous web agent for automatic end-to-end testing of websites, combining a distributed architecture with advanced task management capabilities. Developed during my internship at LaBRI, it utilizes Docker containers for scalable deployment and testing infrastructure.";

const description = `WebWisp is an innovative autonomous web agent developed during my internship at LaBRI. The project implements a distributed architecture designed for scalable web testing and automation, consisting of three main components:

1. **Orchestrator**
   - Manages task distribution to worker pools
   - Provides a web interface for monitoring tasks and results
   - Implements secure authentication and user management

2. **Workers**
   - Execute dispatched tasks with high reliability
   - Scale horizontally for improved performance
   - Leverage Playwright for browser automation
   - Integrate [web-som](/projects/websom-2024) for precise element selection

3. **Message Broker (RabbitMQ)**
   - Ensures reliable communication between components
   - Enables asynchronous task processing
   - Supports system scalability

The system is containerized using Docker, making it easily deployable and scalable. It features:
- JWT-based authentication
- MongoDB integration for data persistence
- Configurable worker pools
- OpenAI API integration for advanced testing capabilities

This work builds upon recent advances in language models and visual grounding techniques [[1]](#ref-1), while addressing the specific challenges of web automation [[2]](#ref-2). The project demonstrates practical applications of distributed systems in web testing while maintaining high reliability and scalability.`;

const technologies = [
  "Docker",
  "RabbitMQ",
  "MongoDB",
  "TypeScript",
  "Playwright",
  "OpenAI API",
  "JWT Authentication"
];

const highlights = [
  "Implemented distributed architecture with worker pools",
  "Developed Docker-based deployment system",
  "Integrated RabbitMQ for reliable message passing",
  "Created web interface for task monitoring",
  "Implemented secure authentication system",
  "Designed scalable worker architecture"
];

const sources = [
  {
    title: "Language Models are Few-Shot Learners",
    authors: [
      "Brown, T. B.", "Mann, B.", "Ryder, N.", "Subbiah, M.", "Kaplan, J.",
      "Dhariwal, P.", "Neelakantan, A.", "Shyam, P.", "Sastry, G.", "Askell, A.",
      "Agarwal, S.", "Herbert-Voss, A.", "Krueger, G.", "Henighan, T.",
      "Child, R.", "Ramesh, A.", "Ziegler, D. M.", "Wu, J.", "Winter, C.",
      "Amodei, D."
    ],
    year: "2020",
    journal: "arXiv preprint arXiv:2005.14165",
    doi: "10.48550/arXiv.2005.14165"
  },
  {
    title: "Set-of-mark prompting unleashes extraordinary visual grounding in GPT-4V",
    authors: ["Yang, J.", "Zhang, H.", "Li, F.", "Zou, X.", "Li, C.", "Gao, J."],
    year: "2023",
    journal: "arXiv preprint arXiv:2310.11441",
    doi: "10.48550/arXiv.2310.11441"
  }
];

const internship = {
  company: "LaBRI",
  location: "Bordeaux, France",
  companyUrl: "https://www.labri.fr"
};

export const webWisp: Project = {
  id: "webwisp-2024",
  title,
  abstract,
  description,
  technologies,
  githubUrl: "https://github.com/brewcoua/webwisp",
  date: "May 2024",
  featured: true,
  highlights,
  role: "Research Intern",
  status: ProjectStatus.COMPLETED,
  duration: "2 months",
  internship,
  sources
}; 