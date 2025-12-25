"use client";

import { memo, useCallback, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { ChartCandlestick } from "lucide-react";
import { getIndicators, getTrend, getTrendUI } from "@/utils";
import FinancialIndicator from "./FinancialIndicator";
import { useFinancial } from "@/hooks/useFinancial";

const Financial: React.FC = () => {
  const { financial } = useFinancial();

  const indicators = useMemo(() => getIndicators(financial), [financial]);

  const getTrendMemo = useCallback(
    (key: "dolar" | "utm" | "btc" | "eth") => getTrend(financial.history, key),
    [financial],
  );

  const mapSparklineData = (data: any[], key: string) => {
    return data.map((item) => ({
      value: item[key] ?? 0,
    }));
  };

  const SparklineChart: React.FC<{ data: any[]; dataKey: string }> = memo(
    ({ data, dataKey }) => (
      <div className="w-full min-h-12">
        <ResponsiveContainer width="100%" height={48}>
          <LineChart data={data}>
            <YAxis hide domain={["dataMin * 0.95", "dataMax * 1.05"]} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip
              cursor={false}
              formatter={(value: number) => value.toLocaleString("es-CL")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
  );

  return (
    <div className="bg-blue-50 text-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold flex gap-2 mb-4 border-b pb-2">
        <ChartCandlestick size={25} />
        Indicadores Financieros
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <FinancialIndicator
              id={`indicator-${ind.key}`}
              label={ind.label}
              value={ind.value}
              trend={getTrendMemo(ind.key)}
            />

            <SparklineChart
              data={mapSparklineData(financial.history, ind.key)}
              dataKey="value"
            />

            <span className="sr-only">
              {`${ind.label} actual: ${ind.value.toLocaleString(
                "es-CL",
              )}, tendencia: ${getTrendUI(getTrendMemo(ind.key)).label}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Financial);
