import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of academic and personal projects in software development.",
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 