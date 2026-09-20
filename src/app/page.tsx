"use client";

import Link from "next/link";
import { FilePlus2, MessagesSquare, ShieldCheck, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/use-diagnostics";

const features = [
  {
    icon: FilePlus2,
    title: "Add sources",
    description: "Paste text or a URL to build your knowledge base.",
  },
  {
    icon: MessagesSquare,
    title: "Ask with citations",
    description: "Every answer points back to the sources it used.",
  },
  {
    icon: ShieldCheck,
    title: "Private by account",
    description: "Your sources are visible only to your account.",
  },
];

export default function Home() {
  const { isAuthReady, isAiReady, loading } = useDiagnostics();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10"
              aria-hidden="true"
            >
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">RAG Workspace</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            An upload-free knowledge base — add text and URL sources, then ask
            questions with cited answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            {loading || !isAiReady ? (
              <Button disabled>Try AI Chat</Button>
            ) : (
              <Button asChild>
                <Link href="/chat">Try AI Chat</Link>
              </Button>
            )}
            {loading || !isAuthReady ? (
              <Button variant="outline" disabled>
                View Dashboard
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 border rounded-lg">
              <h2 className="font-semibold mb-2 flex items-center gap-2">
                <feature.icon className="h-4 w-4" aria-hidden="true" />
                {feature.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
