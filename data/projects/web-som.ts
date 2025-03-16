import { Project, ProjectStatus } from "@/types";

const title = "Web SoM (Set-of-Marks)";

const abstract = "A specialized framework implementing the Set-of-Marks approach for web element interaction, enabling precise visual grounding and enhanced interaction capabilities for web automation tools.";

const description = `Web SoM is a specialized framework that implements the Set-of-Marks approach (Yang et al., 2023) for web element interaction. This project was developed alongside [WebWisp](/projects/webwisp-2024) during my internship at LaBRI.

The framework provides:
- Implementation of the Set-of-Marks approach for web elements
- Enhanced visual grounding capabilities
- Integration with multimodal LLMs
- Precise element selection and interaction
- Support for complex web automation scenarios

Building upon recent advances in visual grounding (Yang et al., 2023) and language model capabilities (Brown et al., 2020), Web SoM enables more precise and reliable web automation.`;

const technologies = [
  "TypeScript",
  "Playwright",
  "Computer Vision",
  "Multimodal LLMs"
];

const highlights = [
  "Implemented Set-of-Marks approach for web elements",
  "Developed precise element selection algorithms",
  "Created integration layer for multimodal LLMs",
  "Enhanced visual grounding capabilities",
  "Enabled complex web automation scenarios"
];

const sources = [
  {
    title: "Set-of-mark prompting unleashes extraordinary visual grounding in GPT-4V",
    authors: ["Yang, J.", "Zhang, H.", "Li, F.", "Zou, X.", "Li, C.", "Gao, J."],
    year: "2023",
    journal: "arXiv preprint arXiv:2310.11441",
    doi: "10.48550/arXiv.2310.11441"
  },
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
  }
];

const internship = {
  company: "LaBRI",
  location: "Bordeaux, France",
  companyUrl: "https://www.labri.fr"
};

export const webSom: Project = {
  id: "websom-2024",
  title,
  abstract,
  description,
  technologies,
  githubUrl: "https://github.com/brewcoua/web-som",
  thumbnail: "/thumbnails/websom-2024.png",
  date: "May 2024",
  featured: true,
  highlights,
  role: "Research Project",
  status: ProjectStatus.COMPLETED,
  duration: "3 months",
  internship,
  sources
}; 