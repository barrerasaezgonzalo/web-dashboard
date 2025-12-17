"use client";

import React from "react";
import { getTooltipClass } from "@/app/styles/labelStyles";
import { TaskActionButtonProps } from "@/types";

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  icon,
  tooltipType = "default",
  tooltipText,
  onClick,
  inDev = false,
  dragging = false,
  dragHandleProps,
}) => {
  return (
    <button
      onClick={onClick}
      {...dragHandleProps}
      className="relative inline-block group"
    >
      {icon}
      <div className={getTooltipClass({ type: tooltipType, inDev, dragging })}>
        {tooltipText}
      </div>
    </button>
  );
};
