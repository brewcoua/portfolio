"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ArrowLeft, Calendar, Users, Clock, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import projectsData from "@/data/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectStatusVariant } from "@/types";

export default function ProjectPage() {
  const params = useParams();
  const project = projectsData.projects.find(p => p.id === params.id);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  if (!project) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl space-y-8 pt-24 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-32" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Skeleton className="absolute inset-0" />
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>

                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl space-y-8 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
              {project.liveUrl && (
                <Button variant="outline" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="relative w-full rounded-lg overflow-hidden bg-muted">
            {project.thumbnail && !imageError ? (
              <Image
                src={project.thumbnail}
                alt={`${project.title} thumbnail`}
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-muted-foreground/50 flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12" strokeWidth={1.5} />
                  <span className="text-sm">Image not available</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <p>{project.date}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <p>{project.duration}</p>
                </div>
                {project.teamSize && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Team Size
                    </div>
                    <p>{project.teamSize}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Role</h3>
                <p className="text-muted-foreground">{project.role}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge variant={getProjectStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.longDescription || project.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {project.highlights?.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 