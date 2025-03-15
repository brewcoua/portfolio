import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container max-w-4xl space-y-8 pt-24 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
        <Card>
          <CardContent className="p-6 space-y-4">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Education</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">BSc in Computer Science</h3>
                  <p className="text-muted-foreground">
                    University of Bordeaux • Current Student
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Exchange Student at Hanyang University (Sep 2024 - Jul 2025)
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Academic Interests</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Software Engineering and Architecture</li>
                <li>Algorithms and Data Structures</li>
                <li>Web Development and Modern Technologies</li>
                <li>Database Systems and Data Management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Goals</h2>
              <p className="text-muted-foreground">
                I am passionate about creating efficient, scalable solutions to complex problems. 
                My goal is to contribute to innovative projects while continuously learning and 
                growing as a software developer.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 