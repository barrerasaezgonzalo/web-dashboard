import { ProgressCircleProps } from "@/types/";

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  done_count,
}) => {
  return (
    <svg className="absolute -rotate-90 w-12 h-12">
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="transparent"
        className="text-gray-200"
      />
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={125.6}
        strokeDashoffset={125.6 - (125.6 * Math.min(done_count, 21)) / 21}
        fill="transparent"
        className="text-blue-500 transition-all duration-500"
      />
    </svg>
  );
};
