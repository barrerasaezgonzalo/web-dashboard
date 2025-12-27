"use client";

import React from "react";
import { getTooltipClass } from "@/app/styles/labelStyles";
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
      <div className={getTooltipClass({ type: tooltipType, inDev })}>
        {tooltipText}
      </div>
    </button>
  );
};
