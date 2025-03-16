import { Project, ProjectStatus } from "@/types";

const title = "WebWisp";

const abstract = "An autonomous web agent that combines advanced task management with real-time browser interaction capabilities, utilizing multimodal LLMs and the Web SoM framework for enhanced visual grounding and interaction.";

const description = `WebWisp is an innovative autonomous web agent developed during my internship at LaBRI. It leverages state-of-the-art multimodal language models and the [Web SoM](/projects/websom-2024) framework to enable sophisticated web interactions.

The project implements a novel approach to web automation by combining:
- Real-time browser interaction capabilities through Playwright
- Advanced task management and dispatching system
- Visual grounding using multimodal LLMs
- Integration with the [Web SoM](/projects/websom-2024) framework for enhanced element interaction

This work builds upon recent advances in language models and visual grounding techniques (Brown et al., 2020; Yang et al., 2023), while addressing the specific challenges of web automation.`;

const technologies = [
  "React",
  "NestJS",
  "TypeScript",
  "Playwright",
  "Multimodal LLMs",
  "Web SoM"
];

const highlights = [
  "Developed an autonomous web agent with React-based client",
  "Implemented real-time task dispatching system",
  "Integrated full browser previews",
  "Utilized Web SoM for enhanced element interaction",
  "Implemented multimodal LLM-based visual grounding"
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
  role: "Research Project",
  status: ProjectStatus.COMPLETED,
  duration: "3 months",
  internship,
  sources
}; 