import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <a href="#" className="font-display text-xl font-bold text-gradient">DY.</a>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Damilola Yinusa. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/Damilola-Yinusa" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/in/damilola-yinusa" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="mailto:hi@thedamiyinusa.com" className="text-muted-foreground transition-colors hover:text-primary">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
