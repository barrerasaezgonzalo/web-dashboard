import { MovementFooterProps } from "@/types/";
import React from "react";

export const MovementFooter: React.FC<MovementFooterProps> = ({
  total,
  isPrivate,
}) => {
  return (
    <div className="flex justify-between items-center gap-2 ">
      <div
        className={`text-xl font-bold text-white${
          isPrivate ? "privacy-blur" : ""
        }`}
      >
        Total: ${total.toLocaleString()}
      </div>
    </div>
  );
};
