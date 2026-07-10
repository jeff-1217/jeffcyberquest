"use client";

import * as React from "react";
import { Shield } from "lucide-react";
import { categoryIconMap } from "@/lib/ui";

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = categoryIconMap[name] ?? Shield;
  return <Icon className={className} />;
}
