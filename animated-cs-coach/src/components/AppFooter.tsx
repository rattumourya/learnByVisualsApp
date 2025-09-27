export function AppFooter() {
  return (
    <footer className="border-t border-border bg-background/80 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row md:px-6">
        <p>&copy; {new Date().getFullYear()} Animated CS Coach. Built with React, Tailwind CSS, and Framer Motion.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-primary" href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-primary" href="https://twitter.com" target="_blank" rel="noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
