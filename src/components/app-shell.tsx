"use client";

import * as React from "react";
import { ShieldCheck, Home, ListChecks, Library, LayoutDashboard, Github } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { key: "home", label: "Home", icon: Home },
  { key: "tests", label: "Tests", icon: ListChecks },
  { key: "bank", label: "Question Bank", icon: Library },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const view = useApp((s) => s.view);
  const go = useApp((s) => s.go);

  const activeKey = (() => {
    if (view.name === "runner" || view.name === "results") return "tests";
    return view.name;
  })();

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <button
              onClick={() => go({ name: "home" })}
              className="group flex items-center gap-2.5"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-blink" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-mono text-base font-bold tracking-tight">
                  Cyber<span className="text-primary">Quest</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Sec MCQ Lab
                </span>
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeKey === item.key;
                return (
                  <Button
                    key={item.key}
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => go({ name: item.key as "home" })}
                    className={cn(
                      "gap-2 font-medium",
                      active && "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="https://owasp.org"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex"
              >
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Github className="h-4 w-4" />
                  <span className="hidden lg:inline">OWASP</span>
                </Button>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-border/60 bg-background/60">
          <div className="mx-auto w-full max-w-7xl px-2">
            <div className="flex items-center gap-1 overflow-x-auto py-2 cyber-scroll">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => go({ name: item.key as "home" })}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/70 bg-background/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-mono">
                CyberQuest — built for defenders.
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono">
                <span className="text-primary">$</span> stay_vigil
                <span className="animate-blink">_</span>
              </span>
              <span>© {new Date().getFullYear()} CyberQuest</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
