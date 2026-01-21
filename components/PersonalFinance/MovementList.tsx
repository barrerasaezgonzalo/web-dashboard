import React, { useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { MovementListProps } from "@/types/";
import {
  calculateCategoryStats,
  formatCLP,
  formatDateToDMY,
  getCategoryLabel,
} from "@/utils";
import {
  ChevronDown,
  ChevronUp,
  SquarePen,
  Trash,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const MovementList: React.FC<MovementListProps> = ({
  groupedData,
  isPrivate,
  onEdit,
  onDelete,
  graphList = [],
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const statsBYCategory = useMemo(
    () => calculateCategoryStats(graphList),
    [graphList],
  );

  const groupedArray = Object.values(groupedData);

  return (
    <div className="flex flex-col gap-2">
      {groupedArray.map((group) => {
        const statsKey = `${group.type}-${group.category}`;
        const stats = statsBYCategory[statsKey];
        const variation = stats?.variation || 0;
        const hasComparison = stats?.hasComparison || false;
        const isExpanded = expandedCategory === statsKey;

        return (
          <div
            key={statsKey}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="flex items-center w-full p-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : statsKey)
                }
                className="flex items-center cursor-pointer justify-between w-full p-3 gap-3 text-left transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[12px] uppercase tracking-wider text-blue-600 truncate ${isPrivate ? "privacy-blur" : ""}`}
                  >
                    {getCategoryLabel(group.type, group.category)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-blue-400" />
                  ) : (
                    <ChevronDown
                      size={14}
                      className="text-gray-300 group-hover:text-blue-400"
                    />
                  )}
                </div>

                {/* Variación */}
                <div className="flex items-center gap-1 min-h-3.5">
                  {group.type === "bills" &&
                    hasComparison &&
                    variation !== 0 && (
                      <span
                        className={`flex items-center text-[10px] font-bold ${variation > 0 ? "text-red-500" : "text-emerald-500"}`}
                      >
                        {variation > 0 ? (
                          <TrendingUp size={10} className="mr-0.5" />
                        ) : (
                          <TrendingDown size={10} className="mr-0.5" />
                        )}
                        {Math.abs(variation).toFixed(1)}%
                      </span>
                    )}
                </div>

                {/* Mini Gráfico */}
                <div className="h-7 w-16 sm:w-20">
                  {group.type === "bills" &&
                  stats?.pointsToGraph?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.pointsToGraph}>
                        <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            !hasComparison
                              ? "#cbd5e1"
                              : variation > 0
                                ? "#ef4444"
                                : "#10b981"
                          }
                          strokeWidth={2.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-20">
                      <div className="w-8 h-px bg-gray-300" />
                    </div>
                  )}
                </div>

                <div className="text-right min-w-[90px]">
                  <span
                    className={`font-bold text-sm text-gray-900 ${isPrivate ? "privacy-blur" : ""}`}
                  >
                    {formatCLP(group.total)}
                  </span>
                </div>
              </button>
            </div>

            {/* Detalles expandibles */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="divide-y divide-gray-200/50">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3"
                      >
                        <span className="text-[12px] font-medium text-gray-400">
                          {formatDateToDMY(item.date)}
                        </span>

                        {item.description && (
                          <span
                            title={item.description}
                            className="text-[12px] text-slate-500 italic truncate max-w-[100px] px-2 sm:max-w-[200px]"
                          >
                            {item.description}
                          </span>
                        )}

                        <div className="flex items-center gap-4">
                          <span
                            className={`text-sm font-semibold text-gray-700 ${isPrivate ? "privacy-blur" : ""}`}
                          >
                            {formatCLP(item.value)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1 text-blue-400 cursor-pointer hover:bg-blue-100 rounded"
                            >
                              <SquarePen size={22} />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-1 text-red-400 cursor-pointer hover:bg-red-100 rounded"
                            >
                              <Trash size={22} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
