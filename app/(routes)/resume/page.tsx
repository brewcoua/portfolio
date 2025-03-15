import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function ResumePage() {
  return (
    <div className="container max-w-4xl space-y-8 pt-24 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Resume</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="space-y-6">
        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">BSc in Computer Science</h3>
              <p className="text-sm text-muted-foreground">Your University • Expected Graduation 20XX</p>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                <li>Relevant coursework: Data Structures, Algorithms, Database Systems</li>
                <li>GPA: X.XX</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Programming Languages</h3>
                <p className="text-sm text-muted-foreground">
                  Python, JavaScript/TypeScript, Java, C++
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Web Technologies</h3>
                <p className="text-sm text-muted-foreground">
                  React, Next.js, Node.js, HTML/CSS, Tailwind CSS
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tools & Platforms</h3>
                <p className="text-sm text-muted-foreground">
                  Git, Docker, AWS, Linux, PostgreSQL, MongoDB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add your experiences here */}
            <div>
              <h3 className="font-semibold">Software Development Intern</h3>
              <p className="text-sm text-muted-foreground">Company Name • Summer 20XX</p>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                <li>Developed and maintained web applications using React and Node.js</li>
                <li>Collaborated with senior developers on various projects</li>
                <li>Implemented new features and fixed bugs in existing applications</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold">Project Name</h3>
              <p className="text-sm text-muted-foreground">Technologies: React, Node.js, MongoDB</p>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                <li>Developed a full-stack web application</li>
                <li>Implemented user authentication and authorization</li>
                <li>Created RESTful API endpoints</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 