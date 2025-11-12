"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface EducationSectionProps {
  education: ResumeData["education"];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={`${edu.institution}-${edu.startDate}-${index}`}>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-semibold">{edu.institution}</h3>
                <p className="text-sm text-muted-foreground">{edu.degree}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
              {edu.gpa && <li>{edu.gpa}</li>}
              {(edu.details ?? []).map((detail, detailIndex) => (
                <li key={`${edu.institution}-detail-${detailIndex}`}>{detail}</li>
              ))}
            </ul>
            {edu.exchanges && edu.exchanges.length > 0 && (
              <div className="mt-4 space-y-4 border-l pl-4">
                {edu.exchanges.map((exchange, exchangeIndex) => (
                  <div
                    key={`${exchange.institution}-${exchange.startDate}-${exchangeIndex}`}
                  >
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                      <div>
                        <h4 className="font-semibold">
                          Exchange — {exchange.institution}
                        </h4>
                        {exchange.program && (
                          <p className="text-sm text-muted-foreground">{exchange.program}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{exchange.location}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {exchange.startDate} - {exchange.endDate}
                      </p>
                    </div>
                    {(exchange.gpa || (exchange.details && exchange.details.length > 0)) && (
                      <ul className="mt-2 list-disc list-inside text-xs text-muted-foreground space-y-1">
                        {exchange.gpa && <li>{exchange.gpa}</li>}
                        {(exchange.details ?? []).map((detail, detailIndex) => (
                          <li key={`${exchange.institution}-detail-${detailIndex}`}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

