"use client";

import { formatCLP } from "@/utils";
import { memo, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import FinancialIndicator from "./FinancialIndicator";
import { useFinancial } from "@/hooks/useFinancial";
import { FinancialHistory } from "@/types";

const Financial: React.FC = ({}) => {
  const { financial } = useFinancial();

  const indicators = [
    { label: "Dólar", value: `$${financial.current.dolar}`, key: "dolar" },
    { label: "UTM", value: formatCLP(financial.current.utm), key: "utm" },
    { label: "BTC", value: formatCLP(financial.current.btc), key: "btc" },
    { label: "ETH", value: formatCLP(financial.current.eth), key: "eth" },
  ];

  const sparklineData = useMemo(() => {
    return financial.history.map((f: FinancialHistory) => ({
      date: f.created_at,
      dolar: f.dolar,
      utm: f.utm,
      btc: f.btc,
      eth: f.eth,
    }));
  }, [financial.history]);

  const getTrend = (key: "dolar" | "utm" | "btc" | "eth") => {
    const lastHistory = financial.history[financial.history.length - 1];
    const prevHistory = financial.history[financial.history.length - 2];

    if (!prevHistory) return null;
    if (lastHistory[key] > prevHistory[key]) return "up";
    if (lastHistory[key] < prevHistory[key]) return "down";
    return "same";
  };

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
              trend={getTrend(ind.key as any)}
            />

            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey={ind.key}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Financial);
