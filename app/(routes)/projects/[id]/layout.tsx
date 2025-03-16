import { type Metadata } from "next"
import projectsData from "@/data/projects"

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projectsData.projects.find(p => p.id === params.id);
  
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