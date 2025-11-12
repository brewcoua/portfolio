"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface LanguagesSectionProps {
  languages: ResumeData["languages"];
}

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  const midpoint = Math.ceil(languages.length / 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            {languages.slice(0, midpoint).map((lang, index) => (
              <div key={`${lang.language}-${index}`}>
                <h3 className="font-semibold">{lang.language}</h3>
                <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {languages.slice(midpoint).map((lang, index) => (
              <div key={`${lang.language}-${index + midpoint}`}>
                <h3 className="font-semibold">{lang.language}</h3>
                <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

