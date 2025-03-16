import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume",
  description: "View my professional experience, education, and skills.",
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 