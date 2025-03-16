import { ProjectsData } from "@/types";
import { webSom } from "./websom";
import { webWisp } from "./webwisp";
import { promyze } from "./promyze";
import { portfolio } from "./portfolio";
import { jbCli } from "./jb";

const projectsData: ProjectsData = {
  projects: [
    portfolio,
    webWisp,
    webSom,
    jbCli,
    promyze
  ]
};

export default projectsData; 