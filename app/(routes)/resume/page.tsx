"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Github, Mail, Link as LinkIcon, MapPin } from "lucide-react";
import resumeData from "@/public/resume.json";
import { useState } from "react";

export default function ResumePage() {
  const { personal, education, experience, languages, certifications } =
    resumeData;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gen-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${personal.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="container max-w-4xl space-y-8 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">{personal.name}</h1>
          <p className="text-lg text-muted-foreground">{personal.title}</p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={isGenerating}>
          <FileDown className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Download PDF"}
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
                <a
                  href={`mailto:${personal.email}`}
                  className="text-primary hover:underline"
                >
                  {personal.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={`https://${personal.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {personal.website}
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4" />
                <a
                  href={`https://github.com/${personal.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @{personal.github}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{personal.location}</span>
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
          {experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
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
                  <li key={achIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
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
                {edu.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-semibold">
                  {cert.name} - {cert.score} | {cert.year}
                </h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              </div>
            ))}
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
              {languages.slice(0, 2).map((lang, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{lang.language}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.proficiency}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {languages.slice(2).map((lang, index) => (
                <div key={index + 2}>
                  <h3 className="font-semibold">{lang.language}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.proficiency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
