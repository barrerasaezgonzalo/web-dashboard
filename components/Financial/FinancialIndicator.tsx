import { FinancialIndicatorProps, Trend } from "@/types";

function getTrendUI(trend: Trend) {
  switch (trend) {
    case "up":
      return {
        color: "text-green-600",
        label: "Tendencia en alta",
      };
    case "down":
      return {
        color: "text-red-600",
        label: "Tendencia en baja",
      };
    case "flat":
      return {
        color: "text-gray-500",
        label: "Lateral",
      };
    default:
      return {
        color: "text-gray-400",
        label: "Sin datos",
      };
  }
}

const FinancialIndicator: React.FC<FinancialIndicatorProps> = ({
  label,
  value,
  trend,
}) => {
  const { color, label: trendLabel } = getTrendUI(trend);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>

      <span className="text-lg font-semibold">
        {value.toLocaleString("es-CL")}
      </span>

      <span className={`text-xs font-medium ${color}`}>{trendLabel}</span>
    </div>
  );
};

export default FinancialIndicator;
