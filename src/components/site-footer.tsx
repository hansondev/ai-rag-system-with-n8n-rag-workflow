import { GitHubStars } from "./ui/github-stars";

export function SiteFooter() {
  return (
    <footer className="border-t py-4 sm:py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-3">
          <GitHubStars repo="hansondev/ai-rag-system-with-n8n-rag-workflow" />
          <p>
            Built by{" "}
            <a
              href="https://github.com/hansondev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hanson Dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
