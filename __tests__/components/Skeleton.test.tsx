import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/Skeleton";

describe("Skeleton Component", () => {
  it("renders the default skeleton", () => {
    render(<Skeleton />);
    const container = screen.getByTestId("skeleton");
    expect(container).toBeInTheDocument();

    // 3 filas por defecto
    const rows = container.querySelectorAll("div");
    expect(rows.length).toBe(3);
  });

  it("renders custom number of rows and height", () => {
    render(<Skeleton rows={5} height={50} />);
    const container = screen.getByTestId("skeleton");

    const rows = container.querySelectorAll("div");
    expect(rows.length).toBe(5);

    rows.forEach((row) => {
      expect(row).toHaveStyle("height: 50px");
    });
  });
});
