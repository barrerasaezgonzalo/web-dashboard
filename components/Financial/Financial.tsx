"use client";

import { getIndicators, getTrend, mapSparklineData } from "@/utils";
import { memo, useCallback, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import FinancialIndicator from "./FinancialIndicator";
import { useFinancial } from "@/hooks/useFinancial";

const Financial: React.FC = ({}) => {
  const { financial } = useFinancial();
  const indicators = useMemo(
    () => getIndicators(financial),
    [financial.history],
  );
  const sparklineData = useMemo(
    () => mapSparklineData(financial.history),
    [financial.history],
  );

  const getTrendMemo = useCallback(
    (key: "dolar" | "utm" | "btc" | "eth") => getTrend(financial.history, key),
    [financial.history],
  );

  const SparklineChart: React.FC<{ data: any[]; dataKey: string }> = memo(
    ({ data, dataKey }) => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    ),
  );
  return (
    <div className="bg-blue-50 text-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Indicadores Financieros
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <FinancialIndicator
              label={ind.label}
              value={ind.value}
              trend={getTrendMemo(ind.key)}
            />

            <div className="h-12" data-testid={`sparkline-${ind.key}`}>
              <SparklineChart data={sparklineData} dataKey={ind.key} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Financial);
