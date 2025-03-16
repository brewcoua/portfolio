"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-3 text-4xl">
        <h2 className="font-semibold">404</h2>
        <span className="text-muted-foreground">|</span>
        <p>Not found</p>
      </div>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </main>
  );
} 