import { FinancialIndicatorProps } from "@/types";
import { memo } from "react";

const FinancialIndicator: React.FC<FinancialIndicatorProps> = ({ label, value, trend }) => {
  const trendSymbol = trend === "up" ? "↑" : trend === "down" ? "↓" : null;
  const trendColor =
    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";

  return (
    <div className="flex justify-between items-center mb-2 flex-col">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className={`font-bold ${trendColor}`}>
        {value} {trendSymbol}
      </span>
    </div>
  );
};

export default memo(FinancialIndicator);
