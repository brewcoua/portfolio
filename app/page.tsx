"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, ExternalLink, Image as ImageIcon, ArrowRight, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import projectsData from "@/data/projects/index";
import skillsData from "@/data/skills";
import { useState, useEffect } from "react";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { SkillCategoryData } from "@/types";

export default function Home() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const featuredProjects = projectsData.projects.filter(project => project.featured);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="container max-w-6xl space-y-16 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I&apos;m Brewen 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-[800px]">
            M.Sc. Computer Science student specializing in software engineering, cloud computing, and systems programming. 
            Passionate about building robust software with a focus on performance and security, while exploring AI integration for practical applications.
            Currently studying at TU Delft in the Netherlands.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://github.com/brewcoua" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2" />
                GitHub
              </a>
            </Button>
            <Button asChild>
              <a href="https://www.linkedin.com/in/brewcoua" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:contact@brewen.dev">
                <Mail className="mr-2" />
                Contact
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Skills & Technologies</h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/resume" target="_blank" rel="noopener noreferrer">
                View Full Resume <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {skillsData.skills.map((category: SkillCategoryData) => (
              <div key={category.category} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <>
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                </>
              ) : (
                featuredProjects.map(project => (
                  <div 
                    key={project.id}
                    className="group cursor-pointer"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                      <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
                        {project.thumbnail && !imageErrors[project.id] ? (
                          <Image
                            src={project.thumbnail}
                            alt={`${project.title} thumbnail`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            onError={() => handleImageError(project.id)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-muted-foreground/20 flex flex-col items-center gap-2">
                              <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3 space-y-2">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.abstract}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 2).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.technologies.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {project.githubUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.githubUrl, '_blank', 'noopener noreferrer');
                                }}
                              >
                                <Github className="h-3.5 w-3.5" />
                                <span className="sr-only">View on GitHub</span>
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.liveUrl, '_blank', 'noopener noreferrer');
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span className="sr-only">View Live Demo</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
