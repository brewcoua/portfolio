"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface ExperienceSectionProps {
  experience: ResumeData["experience"];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional &amp; Research Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {experience.map((exp, index) => (
          <div key={`${exp.company}-${exp.startDate}-${index}`}>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              {exp.achievements.map((achievement, achIndex) => (
                <li key={`${exp.company}-${achIndex}`}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

