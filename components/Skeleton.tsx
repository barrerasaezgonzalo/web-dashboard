"use client";

import React from "react";

interface SkeletonProps {
  rows?: number;
  height?: number; // altura de cada "fila"
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  rows = 3,
  height = 32,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 rounded animate-pulse"
          style={{ height }}
        ></div>
      ))}
    </div>
  );
};
