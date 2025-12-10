"use client";

import { usePerformance } from "@/hooks/usePerformance";

export const PerformancePanel: React.FC = ({}) => {
  const { lcp, ttfb, fcp, cls } = usePerformance();

  return (
    <div
      className="bg-slate-600 text-white text-center items-center p-1 rounded shadow flex flex-row"
      data-testid="PerformancePanel"
    >
      <p className="w-full">
        LCP (Largest Contentful Paint):{" "}
        {lcp !== null ? `${lcp} ms` : "Cargando..."}{" "}
      </p>
      <p className="w-full">
        TTFB (Time to First Byte):{" "}
        {ttfb !== null ? `${ttfb} ms` : "Cargando..."}{" "}
      </p>
      <p className="w-full">
        FCP (First Contentful Paint):{" "}
        {fcp !== null ? `${fcp} ms` : "Cargando..."}{" "}
      </p>
      <p className="w-full">
        CLS (Cumulative Layout Shift):{" "}
        {cls !== null ? `${cls} ms` : "Cargando..."}{" "}
      </p>
    </div>
  );
};
