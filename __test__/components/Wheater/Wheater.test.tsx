import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { WheaterComponent } from "@/components/Wheater/Wheater";
import { useData } from "@/hooks/useData";
import { formatFechaHora } from "@/utils";

jest.mock("@/hooks/useData");
jest.mock("@/utils");

describe("Wheater Component", () => {
  beforeEach(() => {
    (useData as jest.Mock).mockReturnValue({
      wheater: { temperatura: "20°C" },
    });
    (formatFechaHora as jest.Mock).mockReturnValue({
      fecha: "13/12/2025",
      hora: "20:30:00",
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renderiza temperatura, fecha y hora", () => {
    act(() => {
      render(<WheaterComponent />);
      // Avanzamos el setInterval inicial
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("20°C")).toBeInTheDocument();
    expect(screen.getByText("13/12/2025")).toBeInTheDocument();
    expect(screen.getByText("20:30:00")).toBeInTheDocument();
  });
});
