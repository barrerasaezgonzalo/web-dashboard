import { FinancialProps } from "@/types";
import { formatCLP } from "@/utils";
import { Skeleton } from "./Skeleton";
import { memo } from "react";

const Financial: React.FC<FinancialProps> = ({
  financial,
  financialLoading,
}) => {
  if (financialLoading) {
    return <Skeleton rows={5} height={40} />;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 border-b">
        Indicadores Finacieros
      </h2>
      <div>
        <ul className="mt-4 space-y-2">
          <li className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
            <span>Dolar:</span>
            <span>${financial.dolar}</span>
          </li>
          <li className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
            <span>UTM:</span>
            <span>{formatCLP(financial.utm)}</span>
          </li>
          <li className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
            <span>BTC:</span>
            <span>{formatCLP(financial.btc)}</span>
          </li>
          <li className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
            <span>ETH:</span>
            <span>{formatCLP(financial.eth)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(Financial);
