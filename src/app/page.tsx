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

  // Automatically unregister any active service workers from other apps (e.g. WiFi DensePose)
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log("Unregistered orphan service worker:", registration);
              window.location.reload();
            }
          });
        }
      });
    }
  }, []);

  const node = (() => {
    switch (view.name) {
      case "home":
        return <HomeView />;
      case "tests":
        return <TestsView />;
      case "runner":
        return <TestRunnerView testId={view.testId} />;
      case "results":
        return <ResultsView attemptId={view.attemptId} />;
      case "bank":
        return <QuestionBankView />;
      case "drill":
        return <QuestionBankView drillMode />;
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
