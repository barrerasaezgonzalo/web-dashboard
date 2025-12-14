import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FinancialIndicator from "@/components/Financial/FinancialIndicator";
import { Trend } from "@/types";

describe("FinancialIndicator Component", () => {
  const label = "Dólar";

  test("renderiza label y valor correctamente", () => {
    render(<FinancialIndicator label={label} value={1000} trend="up" />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("1.000")).toBeInTheDocument();
  });

  test("muestra la tendencia correcta para 'up'", () => {
    render(<FinancialIndicator label={label} value={1000} trend="up" />);
    expect(screen.getByText("Tendencia en alta")).toHaveClass("text-green-600");
  });

  test("muestra la tendencia correcta para 'down'", () => {
    render(<FinancialIndicator label={label} value={1000} trend="down" />);
    expect(screen.getByText("Tendencia en baja")).toHaveClass("text-red-600");
  });

  test("muestra la tendencia correcta para 'flat'", () => {
    render(<FinancialIndicator label={label} value={1000} trend="flat" />);
    expect(screen.getByText("Lateral")).toHaveClass("text-gray-500");
  });

  test("muestra la tendencia por defecto si trend es undefined", () => {
    render(
      <FinancialIndicator
        label={label}
        value={1000}
        trend={undefined as unknown as Trend}
      />,
    );
    expect(screen.getByText("Sin datos")).toHaveClass("text-gray-400");
  });
});
