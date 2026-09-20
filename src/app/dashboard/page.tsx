"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { useSession } from "@/lib/auth-client";

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

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const { isAiReady, loading: diagnosticsLoading } = useDiagnostics();
  const [sources, setSources] = useState<Source[] | null>(null);
  const [sourcesError, setSourcesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSources() {
      try {
        const res = await fetch("/api/sources");
        if (!res.ok) throw new Error(`Failed to load sources (HTTP ${res.status})`);
        const data = (await res.json()) as Source[];
        if (!cancelled) {
          setSources(data);
          setSourcesError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setSourcesError(
            e instanceof Error ? e.message : "Failed to load sources"
          );
        }
      }
    }

    fetchSources();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner aria-label="Loading" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access the dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const total = sources?.length ?? 0;
  const ready = sources?.filter((s) => s.status === "ready").length ?? 0;
  const failed = sources?.filter((s) => s.status === "failed").length ?? 0;
  const recent = sources?.slice(0, 5) ?? [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Your knowledge base</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/chat">Ask a question</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sources">Add sources</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sources overview</CardTitle>
            <CardDescription>
              What your assistant can currently search
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sourcesError ? (
              <p className="text-sm text-destructive">{sourcesError}</p>
            ) : sources === null ? (
              <div className="flex items-center gap-2 py-4">
                <Spinner size="sm" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">
                  Loading sources
                </span>
              </div>
            ) : total === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No sources yet. Add text or a URL to get started.
                </p>
                <Button asChild size="sm">
                  <Link href="/sources">Add sources</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-md">
                    <p className="text-2xl font-semibold">{total}</p>
                    <p className="text-xs text-muted-foreground">
                      Total sources
                    </p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-2xl font-semibold">{ready}</p>
                    <p className="text-xs text-muted-foreground">Ready</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-2xl font-semibold">{failed}</p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {recent.map((source) => (
                    <li key={source.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{source.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {source.status === "ready" ? "Ready" : "Failed"}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sources">View all sources</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Chat</CardTitle>
            <CardDescription>
              Ask questions with cited answers from your sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {diagnosticsLoading || !isAiReady ? (
              <Button disabled>Go to Chat</Button>
            ) : (
              <Button asChild>
                <Link href="/chat">Go to Chat</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
