"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { HomeView } from "@/components/views/home-view";
import { TestsView } from "@/components/views/tests-view";
import { TestRunnerView } from "@/components/views/test-runner-view";
import { ResultsView } from "@/components/views/results-view";
import { QuestionBankView } from "@/components/views/question-bank-view";
import { DashboardView } from "@/components/views/dashboard-view";

export default function Home() {
  const view = useApp((s) => s.view);

  const node = (() => {
    switch (view.name) {
      case "home":
        return <HomeView />;
      case "tests":
        return <TestsView />;
      case "runner":
        return <TestRunnerView testId={view.testId} />;
      case "results":
        return <ResultsView />;
      case "bank":
        return <QuestionBankView />;
      case "dashboard":
        return <DashboardView />;
      default:
        return <HomeView />;
    }
  })();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={view.name + (view.name === "runner" ? view.testId : "") + (view.name === "results" ? "results" : "")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {node}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
