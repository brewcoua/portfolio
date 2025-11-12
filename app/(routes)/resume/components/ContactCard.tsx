"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Link as LinkIcon, Mail, MapPin } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface ContactCardProps {
  personal: ResumeData["personal"];
}

export function ContactCard({ personal }: ContactCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${personal.email}`} className="text-primary hover:underline">
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
  );
}

