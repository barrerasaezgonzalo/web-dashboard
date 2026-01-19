"use client";

import React from "react";
import { TaskActionButtonProps } from "@/types/";

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  icon,
  tooltipType = "default",
  tooltipText,
  onClick,
  inDev = false,
}) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-block group cursor-pointer"
    >
      {icon}
      <div
        className="absolute
    bottom-full 
    left-1/2 
    -translate-x-1/2 
    mb-2
    hidden 
    group-hover:block
    whitespace-nowrap
    rounded 
    bg-gray-900 
    px-2 
    py-1
    text-xs text-white"
      >
        {tooltipText}
      </div>
    </button>
  );
};
