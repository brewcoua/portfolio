import { type Metadata } from "next"
import projectsData from "@/data/projects/index"

interface Props {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}

async function getProject(params: Props['params']) {
  const { id } = await params;
  return Promise.resolve(projectsData.projects.find(p => p.id === id));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params);
  
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }

  return {
    title: `${project.title} / Projects`,
    description: project.description,
  }
}

export default function ProjectLayout({ children }: Props) {
  return children;
} 