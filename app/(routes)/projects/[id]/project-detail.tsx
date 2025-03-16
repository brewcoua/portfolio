"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Github, 
  ImageIcon, 
  Users, 
  BookOpen,
  UserCircle2,
  Activity,
  ZoomIn
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Project, getProjectStatusVariant } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from 'react-markdown';
import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from "next-themes";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [imageError, setImageError] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  
  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Custom components for ReactMarkdown
  const components: Components = {
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-1">{children}</ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 space-y-1">{children}</ul>
    ),
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('#ref-')) {
        // For reference links, just show the number
        return (
          <a href={href} className="text-primary hover:underline" {...props}>
            {children}
          </a>
        );
      }
      return (
        <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    p: ({ children }) => {
      // Convert [^1] style references to anchor links
      const content = React.Children.map(children, child => {
        if (typeof child === 'string') {
          return child.replace(/\[\^(\d+)\]/g, (_, num) => `[${num}](#ref-${num})`);
        }
        return child;
      });
      return <p>{content}</p>;
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      // Manual detection for inline code - if there's no newline, it's inline
      const isInline = typeof children === 'string' && !children.includes('\n');
      
      if (isInline) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      
      // If not mounted yet, show a simple pre block to avoid hydration errors
      if (!isMounted) {
        return (
          <div className="my-6">
            <div className="bg-muted/30 rounded-t-md px-4 py-2 text-xs font-mono border border-border border-b-0">
              {language || 'code'}
            </div>
            <pre className="p-4 overflow-x-auto rounded-b-md border border-border bg-muted/10 text-sm font-mono">
              {children}
            </pre>
          </div>
        );
      }
      
      return (
        <div className="my-6">
          <div className="bg-muted/30 rounded-t-md px-4 py-2 text-xs font-mono border border-border border-b-0">
            {language || 'code'}
          </div>
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={language || 'html'}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '0 0 0.375rem 0.375rem',
              fontSize: '0.9rem',
              border: '1px solid var(--border)',
            } as any}
            showLineNumbers={false}
            wrapLines={true}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
  };

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
              {project.githubUrl && (
                <Button asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
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

          {project.thumbnail && !imageError ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative w-full rounded-lg overflow-hidden bg-muted group cursor-pointer">
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    width={1920}
                    height={1080}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    priority
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay className="z-50" />
                <DialogContent className="sm:max-w-[90vw] w-fit h-fit p-0 overflow-hidden z-50 border-none">
                  <DialogTitle className="sr-only">
                    {project.title} - Full size image
                  </DialogTitle>
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} full size`}
                    width={1920}
                    height={1080}
                    className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
                    priority
                  />
                </DialogContent>
              </DialogPortal>
            </Dialog>
          ) : (
            <div className="relative w-full rounded-lg overflow-hidden bg-muted">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-muted-foreground/50 flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12" strokeWidth={1.5} />
                  <span className="text-sm">Image not available</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {project.abstract}
              </p>
            </CardContent>
          </Card>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <UserCircle2 className="h-4 w-4" />
                    Role
                  </div>
                  <div className="space-y-1">
                    <p>{project.role}</p>
                    {project.internship && (
                      <p className="text-sm text-muted-foreground">
                        Internship at{" "}
                        {project.internship.companyUrl ? (
                          <a
                            href={project.internship.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {project.internship.company}
                          </a>
                        ) : (
                          project.internship.company
                        )}
                        {project.internship.location && ` • ${project.internship.location}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Status
                  </div>
                  <Badge variant={getProjectStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={components}
                skipHtml={false}
                unwrapDisallowed={false}
              >
                {project.description}
              </ReactMarkdown>
            </CardContent>
          </Card>

          {project.highlights && project.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {project.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {project.sources && project.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.sources.map((source, index) => (
                    <div 
                      key={index} 
                      id={`ref-${index + 1}`}
                      className="space-y-2 rounded-md -mx-2 px-2 py-1 target:bg-muted/50 transition-colors duration-300"
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{source.title}</h4>
                          {source.authors && (
                            <p className="text-sm text-muted-foreground">
                              {source.authors.join(", ")}
                              {source.year && ` (${source.year})`}
                            </p>
                          )}
                          {(source.journal || source.conference) && (
                            <p className="text-sm text-muted-foreground italic">
                              {source.journal || source.conference}
                            </p>
                          )}
                          {(source.url || source.doi) && (
                            <p className="text-sm">
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Source
                                </a>
                              )}
                              {source.url && source.doi && " • "}
                              {source.doi && (
                                <a
                                  href={`https://doi.org/${source.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  DOI: {source.doi}
                                </a>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 