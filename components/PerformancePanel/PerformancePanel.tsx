"use client";

import { usePerformance } from "@/hooks/usePerformance";

export const PerformancePanel: React.FC = ({}) => {
  const { lcp, ttfb, fcp, cls } = usePerformance();

  return (
    <div
      className="bg-slate-600 text-white text-center items-center p-1 rounded shadow flex flex-row"
      data-testid="PerformancePanel"
      role="region"
      aria-labelledby="performance-heading"
    >
      <h2 id="performance-heading" className="sr-only">
        Métricas de rendimiento
      </h2>
      <p
        className="w-full"
        aria-label={`Largest Contentful Paint: ${lcp ?? "Cargando"} milisegundos`}
      >
        LCP: {lcp !== null ? `${lcp} ms` : "Cargando..."}
      </p>
      <p
        className="w-full"
        aria-label={`Time to First Byte: ${ttfb ?? "Cargando"} milisegundos`}
      >
        TTFB: {ttfb !== null ? `${ttfb} ms` : "Cargando..."}
      </p>
      <p
        className="w-full"
        aria-label={`First Contentful Paint: ${fcp ?? "Cargando"} milisegundos`}
      >
        FCP: {fcp !== null ? `${fcp} ms` : "Cargando..."}
      </p>
      <p
        className="w-full"
        aria-label={`Cumulative Layout Shift: ${cls ?? "Cargando"}`}
      >
        CLS: {cls !== null ? `${cls} ms` : "Cargando..."}
      </p>
    </div>
  );
};
