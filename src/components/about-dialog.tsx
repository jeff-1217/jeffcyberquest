"use client";

import * as React from "react";
import {
  BookOpen,
  Brain,
  ListChecks,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export function AboutDialog() {
  const [open, setOpen] = React.useState(false);
  const go = useApp((s) => s.go);

  const features = [
    {
      icon: ListChecks,
      title: "Timed MCQ tests",
      desc: "8 domain-specific assessments with live countdowns and instant server-side grading.",
    },
    {
      icon: BookOpen,
      title: "Searchable question bank",
      desc: "100+ questions with explanations. Study mode reveals answers as you learn.",
    },
    {
      icon: Target,
      title: "Answer review",
      desc: "Every attempt shows your answer, the correct one, and a clear explanation.",
    },
    {
      icon: Trophy,
      title: "Progress dashboard",
      desc: "Track scores, pass rate, domain mastery, and time invested over time.",
    },
  ];

  const domains = [
    "Network Security",
    "Cryptography",
    "Web Security",
    "Malware & Threats",
    "IAM",
    "Security Ops",
    "Cloud Security",
    "Ethical Hacking",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span className="hidden lg:inline">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-mono text-lg">
                Cyber<span className="text-primary">Quest</span>
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-[0.2em]">
                Sec MCQ Lab
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <p className="text-sm text-foreground/90 leading-relaxed">
            An interactive platform to practice and master cybersecurity concepts through
            multiple-choice questions. Built for students, aspiring security professionals,
            and anyone who wants to sharpen their defensive skills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-lg border border-border/70 bg-background/50 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/12 text-primary mb-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-semibold">{f.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Brain className="h-3.5 w-3.5" /> Coverage
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-xs font-medium"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <Zap className="h-3.5 w-3.5" /> DISCLAIMER
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              For educational purposes only. Always practice ethical hacking and security
              testing only on systems you own or have explicit permission to test.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => {
                go({ name: "tests" });
                setOpen(false);
              }}
            >
              <ListChecks className="h-4 w-4" /> Start a test
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={() => {
                go({ name: "bank" });
                setOpen(false);
              }}
            >
              <BookOpen className="h-4 w-4" /> Question bank
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
