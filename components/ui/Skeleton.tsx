"use client";

import { SkeletonProps } from "@/types/";
import React from "react";

export const Skeleton: React.FC<SkeletonProps> = ({
  rows = 3,
  height = 32,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`} data-testid="skeleton">
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
