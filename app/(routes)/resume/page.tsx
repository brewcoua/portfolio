import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Github, Mail, Link as LinkIcon, MapPin } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  return (
    <div className="container max-w-4xl space-y-8 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Brewen Couaran</h1>
          <p className="text-lg text-muted-foreground">BSc Comp. Sci. Student</p>
        </div>
        <Button asChild>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@brewen.dev" className="text-primary hover:underline">
                  contact@brewen.dev
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4" />
                <a href="https://www.brewen.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.brewen.dev
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4" />
                <a href="https://github.com/brewcoua" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @brewcoua
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Bordeaux, France | Ansan, South Korea</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Professional & Research Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Research Intern</h3>
                <p className="text-sm text-muted-foreground">Laboratoire Bordelais de Recherche en Informatique (LaBRI)</p>
              </div>
              <p className="text-sm text-muted-foreground">May 2024 - July 2024</p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Developed WebWisp, an autonomous web agent, with a React-based client for real-time task dispatching and full browser previews.</li>
              <li>Collaborated with start-ups to innovate web grounding solutions, including a Set-of-Marks script for interactive elements.</li>
              <li>Created a NestJS server-side API for task management, integrating Multimodal LLMs for dynamic workflows.</li>
              <li>Utilized Playwright for automating user interactions, optimized performance with distributed task queue architecture.</li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Developer Intern</h3>
                <p className="text-sm text-muted-foreground">Packmind (prev. Promyze)</p>
              </div>
              <p className="text-sm text-muted-foreground">June 2023 - August 2023</p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Developed new features like new roles and icons, integrated with Git hosts like GitHub.</li>
              <li>Utilized web technologies such as Javascript, Typescript, AngularJS, and React.</li>
              <li>Created algorithms to recommend modifications in Git history, integrating AI using Chat GPT APIs.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Hanyang University (한양대학교)</h3>
                <p className="text-sm text-muted-foreground">Exchange Student | Bachelor of Science in Computer Science</p>
              </div>
              <p className="text-sm text-muted-foreground">2024 - now</p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Fall Semester GPA: 93.3/100 (KR)</li>
              <li>Residential College Center Member</li>
              <li>International Club Member</li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">University of Bordeaux</h3>
                <p className="text-sm text-muted-foreground">Bachelor of Science in Computer Science | International Track</p>
              </div>
              <p className="text-sm text-muted-foreground">2022 - now</p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>2nd Year GPA: 165.24/200 (FR)</li>
              <li>1st Year GPA: 151.28/200 (FR)</li>
              <li>Selective International Programme Member</li>
              <li>Courses mainly followed in English</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold">CAE C1 English - 194 | 2022</h3>
              <p className="text-sm text-muted-foreground">Cambridge University Assessment English</p>
            </div>
            <div>
              <h3 className="font-semibold">TOEFL iBT - 109 | 2025</h3>
              <p className="text-sm text-muted-foreground">ETS - Educational Testing Service</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">English</h3>
                <p className="text-sm text-muted-foreground">Bilingual proficiency</p>
              </div>
              <div>
                <h3 className="font-semibold">French (Français)</h3>
                <p className="text-sm text-muted-foreground">Native proficiency</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">German (Deutsch)</h3>
                <p className="text-sm text-muted-foreground">Elementary proficiency</p>
              </div>
              <div>
                <h3 className="font-semibold">Korean (한국어)</h3>
                <p className="text-sm text-muted-foreground">Elementary proficiency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 