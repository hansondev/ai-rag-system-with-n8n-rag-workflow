"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Ask" },
  { href: "/sources", label: "Sources" },
];

export function HeaderNav() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="hidden md:flex items-center gap-1" aria-label="Product navigation">
      {navLinks.map((link) => (
        <Button key={link.href} asChild variant="ghost" size="sm">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
}
