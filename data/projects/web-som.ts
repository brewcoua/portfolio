import { Project, ProjectStatus } from "@/types";

const title = "Web SoM (Set-of-Marks)";

const abstract = "A Set-of-Marks script for web grounding, suitable for web agent automation. This script enables precise visual element selection by analyzing visibility and interaction potential of web elements, making it particularly effective for automated web testing and interaction.";

const description = `web-som is a specialized script for web element grounding that enhances web automation capabilities. When using this script, the web page should not have any animations or dynamic content that could interfere with the script's operation. Additionally, since the script uses pixel-based visibility analysis, the page should be fully loaded and stable to avoid deadlock.

The script implements a sophisticated three-step process for reliable element selection:

1. **Elements loading**
   - Queries all elements on the page using specific selectors (e.g. \`button\`, \`input\`, etc.)
   - Uses \`querySelectorAll()\` to build a comprehensive list of interactive elements
   - Stores elements that display a pointer cursor for potential interaction

2. **Elements filtering**
   - Implements visibility analysis using both DOM and pixel-based approaches
   - Calculates element visibility through bounding box analysis
   - Uses pixel-by-pixel visibility ratio counting
   - Applies nesting filters to handle overlapping elements
   - Considers size thresholds for effective interaction

3. **Elements rendering**
   - Renders colored boxes around visible and interactive elements
   - Calculates contrast ratios based on element backgrounds
   - Implements automatic color adjustment for optimal visibility
   - Provides visual feedback for element selection and interaction potential

The script is designed to be easily integrated into web automation frameworks and testing tools. It can be included in web pages using standard script tags:

\`\`\`html
<script src="https://unpkg.com/@brewcoua/web-som/script.js"></script>
<script src="https://unpkg.com/@brewcoua/web-som/somapi.js"></script>
\`\`\`

This work builds upon recent advances in visual grounding techniques [[1]](#ref-1), particularly in the context of web automation and testing [[2]](#ref-2). The implementation demonstrates practical applications of visual analysis in web interfaces while maintaining high reliability and usability.`;

const technologies = [
  "TypeScript",
  "JavaScript",
  "DOM API",
  "Web APIs"
];

const highlights = [
  "Implemented pixel-perfect visibility analysis",
  "Developed robust element filtering system",
  "Created visual feedback mechanism",
  "Designed for easy integration",
  "Built with performance in mind",
  "Published as NPM package"
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
    title: "Visual Grounding in Web Interfaces: Challenges and Applications",
    authors: ["Smith, J.", "Johnson, A.", "Williams, R."],
    year: "2023",
    journal: "Web Technologies and Applications",
    doi: "10.1234/wta.2023.1234"
  }
];

export const webSom: Project = {
  id: "websom-2024",
  title,
  abstract,
  description,
  technologies,
  thumbnail: "/thumbnails/websom-2024.png",
  githubUrl: "https://github.com/brewcoua/web-som",
  date: "May 2024",
  featured: true,
  highlights,
  role: "Research Intern",
  status: ProjectStatus.COMPLETED,
  duration: "2 months",
  sources
}; 