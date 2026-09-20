"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type Source = {
  id: string;
  title: string;
  type: "text" | "url";
  url?: string;
  status: "ready" | "failed";
  error?: string;
  createdAt: string;
  updatedAt: string;
  chunkCount: number;
};

type SourceType = "text" | "url";

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/sources");
      if (!res.ok) throw new Error(`Failed to load sources (HTTP ${res.status})`);
      const data = (await res.json()) as Source[];
      setSources(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchSources, 0);
    return () => window.clearTimeout(timer);
  }, [fetchSources]);

  const resetForm = () => {
    setSourceType("text");
    setTitle("");
    setContent("");
    setUrl("");
  };

  const handleOpenDialog = (open: boolean) => {
    setDialogOpen(open);
    if (open) resetForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedUrl = url.trim();

    if (sourceType === "text") {
      if (!trimmedTitle || !trimmedContent) return;
    } else {
      if (!trimmedUrl.startsWith("https://")) return;
    }

    setPending(true);
    try {
      const body =
        sourceType === "text"
          ? { type: "text", title: trimmedTitle, content: trimmedContent }
          : { type: "url", url: trimmedUrl };
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const created = (await res.json()) as Source;
      if (res.ok && created.status === "failed") {
        toast.error(created.error || "Source failed to process");
      } else if (res.ok) {
        toast.success("Source added");
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error("Failed to add source");
      }
      await fetchSources();
    } catch {
      toast.error("Failed to add source");
      await fetchSources();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (source: Source) => {
    if (!confirm(`Delete "${source.title}"?`)) return;
    try {
      const res = await fetch(`/api/sources/${source.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Source deleted");
      await fetchSources();
    } catch {
      toast.error("Failed to delete source");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sources</h1>
            <p className="text-sm text-muted-foreground">
              Add text or URLs to your knowledge base.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>Add source</Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-8">
            <Spinner size="sm" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Loading sources</span>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={fetchSources}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : sources.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No sources yet. Add your first text or URL to start asking
                questions.
              </p>
              <Button onClick={() => setDialogOpen(true)}>Add source</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 px-2 font-medium">Title</th>
                  <th className="py-2 px-2 font-medium">Type</th>
                  <th className="py-2 px-2 font-medium">Chunks</th>
                  <th className="py-2 px-2 font-medium">Status</th>
                  <th className="py-2 px-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id} className="border-b border-border">
                    <td className="py-2 px-2">
                      <span>{source.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        Updated{" "}
                        {new Date(source.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {source.type === "text" ? "Text" : "URL"}
                    </td>
                    <td className="py-2 px-2">{source.chunkCount}</td>
                    <td className="py-2 px-2">
                      <Badge
                        variant={source.status === "ready" ? "default" : "destructive"}
                      >
                        {source.status === "ready" ? "Ready" : "Failed"}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${source.title}`}
                        onClick={() => handleDelete(source)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add source</DialogTitle>
            <DialogDescription>
              Add text or URLs to your knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2" role="group" aria-label="Source type">
            <Button
              type="button"
              variant={sourceType === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setSourceType("text")}
              aria-pressed={sourceType === "text"}
            >
              Text
            </Button>
            <Button
              type="button"
              variant={sourceType === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setSourceType("url")}
              aria-pressed={sourceType === "url"}
            >
              URL
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {sourceType === "text" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="source-title">Title</Label>
                  <Input
                    id="source-title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Meeting notes"
                    required
                    disabled={pending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-content">Content</Label>
                  <Textarea
                    id="source-content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the text to add…"
                    required
                    disabled={pending}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="source-url">URL</Label>
                  <Input
                    id="source-url"
                    name="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    required
                    disabled={pending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-url-title">Title (optional)</Label>
                  <Input
                    id="source-url-title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Leave blank to use the page title"
                    disabled={pending}
                  />
                </div>
              </>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                Add source
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
