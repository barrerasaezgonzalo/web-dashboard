import { twMerge } from "tailwind-merge";

export const toolTipStyles = `
    absolute
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
    text-xs text-white
    `;

export const getTooltipClass = (options?: {
  type?: "default" | "danger" | "success";
  dragging?: boolean;
  inDev?: boolean;
}) => {
  const { type = "default", dragging = false, inDev = false } = options || {};

  let typeClass = "";
  if (type === "danger") typeClass = "bg-red-600";
  else if (type === "success") typeClass = "bg-green-500";
  else typeClass = "bg-gray-900";

  const draggingClass = dragging ? "!bg-white" : "";

  const inDevClass = inDev ? "bg-blue-500" : "";

  return twMerge(toolTipStyles, typeClass, draggingClass, inDevClass);
};
