"use client";

import { usePerformance } from "@/hooks/usePerformance";
import { useEffect } from "react";
import { onLCP, onTTFB, onFCP, onCLS } from "web-vitals";

export const WebVitals: React.FC = () => {
  const { setLCP, setTTFB, setFCP, setCLS } = usePerformance();

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    onLCP((metric) => setLCP(Math.round(metric.value)), {
      reportAllChanges: true,
    });
    onTTFB((metric) => setTTFB(Math.round(metric.value)));
    onFCP((metric) => setFCP(Math.round(metric.value)));
    onCLS((metric) => setCLS(Math.round(metric.value)), {
      reportAllChanges: true,
    });
  }, [setLCP, setTTFB, setFCP, setCLS]);

  return null;
};
