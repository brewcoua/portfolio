import { Github, Gitlab, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mastodon } from "@/components/icons/mastodon"
import { Codeberg } from "@/components/icons/codeberg"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="w-full py-6 px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/brewcoua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://gitlab.com/brewcoua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitLab"
              >
                <Gitlab className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://codeberg.org/brewcoua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Codeberg"
              >
                <Codeberg className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com/in/brewcoua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://mastodon.social/@brewcoua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mastodon"
              >
                <Mastodon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="mailto:contact@brewen.dev"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Brewen Couaran. All rights reserved.
          </p>
          <div></div>
        </div>
      </div>
    </footer>
  )
} 