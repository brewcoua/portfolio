"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  ExternalLink, 
  ArrowRight, 
  Image as ImageIcon, 
  Search,
  Code2,
  UserCircle2,
  Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects/index";
import { useState, useEffect, useMemo } from "react";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { getProjectStatusVariant, ProjectStatus } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectsPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "all">("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  // Get unique technologies, roles, and statuses
  const technologies = useMemo(() => {
    const techSet = new Set<string>();
    projectsData.projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  const roles = useMemo(() => {
    const roleSet = new Set<string>();
    projectsData.projects.forEach(project => {
      roleSet.add(project.role);
    });
    return Array.from(roleSet).sort();
  }, []);

  const statuses = Object.values(ProjectStatus);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projectsData.projects.filter(project => {
      const matchesSearch = searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTechnology = selectedTechnology === "all" || 
        project.technologies.includes(selectedTechnology);

      const matchesStatus = selectedStatus === "all" || 
        project.status === selectedStatus;

      const matchesRole = selectedRole === "all" || 
        project.role === selectedRole;

      return matchesSearch && matchesTechnology && matchesStatus && matchesRole;
    });
  }, [searchQuery, selectedTechnology, selectedStatus, selectedRole]);

  return (
    <div className="container max-w-6xl space-y-8 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-lg text-muted-foreground">
            A collection of my academic and personal projects.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-nowrap">
              <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                <SelectTrigger className="w-[180px] flex">
                  <div className="flex items-center flex-1 gap-2">
                    <Code2 className="h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Technology" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {technologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedStatus} 
                onValueChange={(value: ProjectStatus | "all") => setSelectedStatus(value)}
              >
                <SelectTrigger className="w-[180px] flex">
                  <div className="flex items-center flex-1 gap-2">
                    <Activity className="h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      <Badge variant={getProjectStatusVariant(status)} className="text-xs">
                        {status}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px] flex">
                  <div className="flex items-center flex-1 gap-2">
                    <UserCircle2 className="h-4 w-4 shrink-0" />
                    <SelectValue placeholder="Role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
        
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
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col">
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
                <div className="flex flex-col flex-1">
                  <CardContent className="pt-4 flex-1">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {project.abstract}
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
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
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
                  </CardFooter>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 