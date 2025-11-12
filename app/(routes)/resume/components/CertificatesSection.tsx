"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface CertificatesSectionProps {
  certifications: ResumeData["certifications"];
}

export function CertificatesSection({ certifications }: CertificatesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert, index) => (
            <div key={`${cert.name}-${cert.year}-${index}`}>
              <h3 className="font-semibold">
                {cert.name} - {cert.score} | {cert.year}
              </h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

