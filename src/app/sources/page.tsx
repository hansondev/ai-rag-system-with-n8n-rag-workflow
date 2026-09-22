"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const ACCEPT = ".txt,.md,.pdf,.docx,.xls,.xlsx";
const POLL_INTERVAL_MS = 4000;

type DocumentDto = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  status: "processing" | "ready" | "failed";
  n8nTrackId: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusLabel(status: DocumentDto["status"]): string {
  if (status === "ready") return "Ready";
  if (status === "failed") return "Failed";
  return "Processing";
}

export default function SourcesPage() {
  const [sources, setSources] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/sources");
      if (!res.ok) throw new Error(`Failed to load sources (HTTP ${res.status})`);
      const data = (await res.json()) as DocumentDto[];
      setSources(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchSources(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchSources]);

  useEffect(() => {
    const anyProcessing = sources.some((s) => s.status === "processing");
    if (!anyProcessing) return;
    const interval = window.setInterval(() => void fetchSources(), POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [sources, fetchSources]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || pending) return;

    setPending(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/sources", { method: "POST", body: form });
      const data = (await res.json()) as DocumentDto | { error: string };
      if (!res.ok) {
        toast.error("error" in data ? data.error : "Upload failed");
      } else {
        toast.success("Document added");
        setFile(null);
      }
      await fetchSources();
    } catch {
      toast.error("Upload failed");
      await fetchSources();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (source: DocumentDto) => {
    if (!window.confirm(`Delete "${source.filename}"?`)) return;
    try {
      const res = await fetch(`/api/sources/${source.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Document deleted");
      await fetchSources();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sources</h1>
          <p className="text-sm text-muted-foreground">
            Upload documents to your private knowledge base.
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="mb-6 flex flex-col sm:flex-row gap-3 items-end"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="document-file">
              Document ({ACCEPT.split(",").join(" ")})
            </Label>
            <Input
              id="document-file"
              type="file"
              accept={ACCEPT}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={pending}
            />
          </div>
          <Button type="submit" disabled={!file || pending}>
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </form>

        {loading ? (
          <div className="flex items-center gap-2 py-8">
            <Spinner size="sm" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Loading sources</span>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => void fetchSources()}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : sources.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No documents yet. Upload your first file to start asking
                questions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 px-2 font-medium">Document</th>
                  <th className="py-2 px-2 font-medium">Size</th>
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
                      <span>{source.filename}</span>
                      <span className="block text-xs text-muted-foreground">
                        Uploaded{" "}
                        {new Date(source.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {formatBytes(source.size)}
                    </td>
                    <td className="py-2 px-2">
                      <Badge
                        variant={
                          source.status === "ready"
                            ? "default"
                            : source.status === "failed"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {statusLabel(source.status)}
                      </Badge>
                      {source.status === "failed" && source.error ? (
                        <span className="block text-xs text-destructive mt-1">
                          {source.error}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${source.filename}`}
                        onClick={() => handleDelete(source)}
                        disabled={source.status === "processing"}
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
    </div>
  );
}