import { FinancialIndicatorProps } from "@/types";
import { getTrendUI } from "@/utils";

const FinancialIndicator: React.FC<FinancialIndicatorProps> = ({
  label,
  value,
  trend,
  id,
}) => {
  const { color, label: trendLabel } = getTrendUI(trend);

  return (
    <div className="flex flex-col gap-1" role="group" aria-labelledby={id}>
      <span id={id} className="text-sm text-gray-600">
        {label}
      </span>

      <span className="text-lg font-semibold">
        {value.toLocaleString("es-CL")}
      </span>

      <span className={`text-xs font-medium ${color}`}>{trendLabel}</span>
    </div>
  );
};

export default FinancialIndicator;
