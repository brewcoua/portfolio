"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ArrowRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects";
import { useState, useEffect } from "react";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { getProjectStatusVariant } from "@/types";
import { type Metadata } from "next"

export default function ProjectsPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  return (
    <div className="container max-w-6xl space-y-8 pt-24 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-lg text-muted-foreground">
          A collection of my academic and personal projects.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            projectsData.projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <Link 
                  href={`/projects/${project.id}`}
                  className="block relative w-full h-48 overflow-hidden group/thumb"
                >
                  <div className="relative w-full h-full bg-muted">
                    {project.thumbnail && !imageErrors[project.id] ? (
                      <Image
                        src={project.thumbnail}
                        alt={`${project.title} thumbnail`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300 group-hover/thumb:bg-muted/75">
                        <div className="text-muted-foreground/20 flex flex-col items-center gap-2">
                          <ImageIcon className="h-12 w-12" strokeWidth={1.5} />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="pt-4 space-y-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant={getProjectStatusVariant(project.status)} className="text-xs">
                        {project.status}
                      </Badge>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Button variant="ghost" size="icon" asChild>
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4" />
                              <span className="sr-only">GitHub</span>
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="ghost" size="icon" asChild>
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Demo</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project.id}`}>
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 