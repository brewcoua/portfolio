import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Mail, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-8">
      <div className="container max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Computer Science Student
          </h1>
          <p className="text-lg text-muted-foreground">
            Passionate about software development and currently pursuing a BSc in Computer Science.
            Building projects and exploring new technologies.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="mailto:your.email@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resume">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/projects" className="transition-colors hover:opacity-80">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Project 1</h3>
                  <p className="text-sm text-muted-foreground">
                    Brief description of your first featured project.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projects" className="transition-colors hover:opacity-80">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Project 2</h3>
                  <p className="text-sm text-muted-foreground">
                    Brief description of your second featured project.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Skills & Technologies</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Languages</h3>
                <p className="text-sm text-muted-foreground">
                  Python, JavaScript, Java, C++
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Web Technologies</h3>
                <p className="text-sm text-muted-foreground">
                  React, Next.js, Node.js, TypeScript
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Tools & Frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  Git, Docker, AWS, MongoDB
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
} 