import { breakpointColumnsObj, pharses } from "@/constants";

describe("Constants tests", () => {
  it("pharses should be an array with correct structure", () => {
    expect(Array.isArray(pharses)).toBe(true);
    expect(pharses.length).toBeGreaterThan(0);

    // Cada elemento debe tener la propiedad 'titulo' como string
    pharses.forEach((item) => {
      expect(item).toHaveProperty("titulo");
      expect(typeof item.titulo).toBe("string");
      expect(item.titulo.length).toBeGreaterThan(0);
    });
  });

  it("breakpointColumnsObj should have correct keys and values", () => {
    expect(breakpointColumnsObj).toHaveProperty("default", 4);
    expect(breakpointColumnsObj).toHaveProperty("1300", 2);
    expect(breakpointColumnsObj).toHaveProperty("768", 1);
    expect(breakpointColumnsObj).toHaveProperty("500", 1);
  });
});
