import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { FinanceHistoryProps } from "@/types/";
import { formatCLP } from "@/utils";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Chart: React.FC<FinanceHistoryProps> = ({ data }) => {
  const { isPrivate } = usePrivacyMode();

  return (
    <div className={`chart-container ${isPrivate ? "privacy-blur-chart" : ""}`}>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />

          <Tooltip formatter={(value: number) => formatCLP(value)} />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 14, color: "#555" }}
          />
          <Line type="monotone" dataKey="ingresos" stroke="#22c55e" />
          <Line type="monotone" dataKey="gastos" stroke="#ef4444" />
          <Line type="monotone" dataKey="ahorros" stroke="#3b82f6" />
          <Line type="monotone" dataKey="saldo" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
