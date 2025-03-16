import { ProjectsData } from "@/types";
import { webSom } from "./web-som";
import { webWisp } from "./webwisp";
import { packmind } from "./packmind";

const projectsData: ProjectsData = {
  projects: [
    webWisp,
    webSom,
    packmind
  ]
};

export default projectsData; 