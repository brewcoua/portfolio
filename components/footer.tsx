import { Github, Gitlab, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mastodon } from "@/components/icons/mastodon"
import { Codeberg } from "@/components/icons/codeberg"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container max-w-4xl py-6 px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://gitlab.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitLab"
              >
                <Gitlab className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://codeberg.org/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Codeberg"
              >
                <Codeberg className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://mastodon.social/@yourusername"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mastodon"
              >
                <Mastodon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="mailto:your.email@example.com"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Your Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 