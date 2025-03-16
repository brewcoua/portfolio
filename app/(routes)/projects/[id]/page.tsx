import type { Metadata } from "next";
import projectsData from "@/data/projects/index";
import { ProjectDetail } from "./project-detail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(params: Props['params']) {
  const { id } = await params;
  // Simulate async data fetching
  return Promise.resolve(projectsData.projects.find(p => p.id === id));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Brewen Couaran`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
} 