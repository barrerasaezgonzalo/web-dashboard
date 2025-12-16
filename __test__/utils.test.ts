import {
  formatCLP,
  abrirGpt,
  abrirGoogle,
  getGreeting,
  parsePromptResponse,
  reorderTasks,
  getIndicators,
  mapSparklineData,
  getTrend,
  handleTextChange,
  formatFechaHora,
  formatPromptOutput,
  roundToThousands,
} from "@/utils";
import {
  Financial,
  FinancialHistory,
  Indicator,
  Task,
  PromptData,
  OrderedFinancialHistory,
} from "@/types";

const mockWindowOpen = jest.fn();
const originalWindowOpen = window.open;

beforeAll(() => {
  window.open = mockWindowOpen;
});

afterAll(() => {
  window.open = originalWindowOpen;
});

const originalConsoleError = console.error;
beforeEach(() => {
  jest.clearAllMocks();
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe("Funciones de Utilidades", () => {
  describe("formatCLP", () => {
    test("debe formatear un número a formato de moneda chilena (CLP) sin decimales", () => {
      expect(formatCLP(1000000)).toBe("$1.000.000");
      expect(formatCLP(1234.56)).toBe("$1.235");
      expect(formatCLP("50000")).toBe("$50.000");
    });
  });

  describe("abrirGpt", () => {
    const setPreguntaMock = jest.fn();

    test("debe abrir una nueva ventana con la URL de ChatGPT codificada y limpiar la pregunta", () => {
      const pregunta = "¿Cómo hacer testing en React?";
      abrirGpt(pregunta, setPreguntaMock);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        " https://chatgpt.com/?prompt=%C2%BFC%C3%B3mo%20hacer%20testing%20en%20React%3F",
        "_blank",
      );
      expect(setPreguntaMock).toHaveBeenCalledWith("");
    });

    test("no debe hacer nada si la pregunta está vacía o solo tiene espacios en blanco", () => {
      abrirGpt(" ", setPreguntaMock);
      expect(mockWindowOpen).not.toHaveBeenCalled();
      expect(setPreguntaMock).not.toHaveBeenCalled();
    });
  });

  describe("abrirGoogle", () => {
    const setPreguntaMock = jest.fn();

    test("debe abrir una nueva ventana con la URL de Google Search codificada y limpiar la pregunta", () => {
      const pregunta = "Componente React con TypeScript";
      abrirGoogle(pregunta, setPreguntaMock);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://www.google.com/search?q=Componente%20React%20con%20TypeScript",
        "_blank",
      );
      expect(setPreguntaMock).toHaveBeenCalledWith("");
    });

    test("no debe hacer nada si la pregunta está vacía o solo tiene espacios en blanco", () => {
      abrirGoogle("", setPreguntaMock);
      expect(mockWindowOpen).not.toHaveBeenCalled();
      expect(setPreguntaMock).not.toHaveBeenCalled();
    });
  });

  describe("getGreeting", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    const setMockDate = (hours: number) => {
      const mockTime = new Date(2025, 0, 1, hours, 0, 0);
      jest.setSystemTime(mockTime);
    };

    test("debe devolver 'Buenos días' antes de las 12:00", () => {
      setMockDate(11);
      expect(getGreeting()).toBe("Buenos días");
      setMockDate(0);
      expect(getGreeting()).toBe("Buenos días");
    });

    test("debe devolver 'Buenas tardes' entre las 12:00 y antes de las 18:00", () => {
      setMockDate(12);
      expect(getGreeting()).toBe("Buenas tardes");
      setMockDate(17);
      expect(getGreeting()).toBe("Buenas tardes");
    });

    test("debe devolver 'Buenas noches' a partir de las 18:00", () => {
      setMockDate(18);
      expect(getGreeting()).toBe("Buenas noches");
      setMockDate(23);
      expect(getGreeting()).toBe("Buenas noches");
    });
  });

  describe("parsePromptResponse", () => {
    test("debe parsear un JSON válido envuelto en bloques de código", () => {
      const raw = `
        \`\`\`json
        { "name": "Test", "value": 123 }
        \`\`\`
      `;
      expect(parsePromptResponse(raw)).toEqual({ name: "Test", value: 123 });
    });

    test("debe parsear un JSON válido sin bloques de código", () => {
      const raw = `
        { "name": "Test", "value": 123 }
      `;
      expect(parsePromptResponse(raw)).toEqual({ name: "Test", value: 123 });
    });

    test("debe parsear un JSON válido con texto circundante", () => {
      const raw = `
        Hola, aquí está el JSON:
        { "name": "Test", "value": 123, "nested": ["a", "b"] }
        Gracias.
      `;
      expect(parsePromptResponse(raw)).toEqual({
        name: "Test",
        value: 123,
        nested: ["a", "b"],
      });
    });

    test("debe parsear JSON contenido dentro de una cadena de texto (a veces la IA lo pone entre comillas)", () => {
      const raw = `
        " \`\`\`json { \\"title\\": \\"Ejemplo\\", \\"data\\": [1, 2, 3] } \`\`\` "
      `;
      expect(parsePromptResponse(raw)).toEqual({
        title: "Ejemplo",
        data: [1, 2, 3],
      });
    });

    test("debe lanzar un error si no se encuentra un JSON válido", () => {
      const raw = "Solo es texto sin JSON.";
      expect(() => parsePromptResponse(raw)).toThrow("JSON no encontrado");
    });

    test("debe lanzar un error si el JSON está malformado (e.g., corchetes desequilibrados)", () => {
      const raw = "{ 'name': 'Test' ";
      expect(() => parsePromptResponse(raw)).toThrow();
    });
  });

  describe("reorderTasks", () => {
    const tasks: Task[] = [
      { id: "1", content: "Tarea 1" } as unknown as Task,
      { id: "2", content: "Tarea 2" } as unknown as Task,
      { id: "3", content: "Tarea 3" } as unknown as Task,
    ];

    test("debe mover una tarea de una posición a otra (adelante)", () => {
      const result = reorderTasks(tasks, 0, 2);
      expect(result.map((t) => t.id)).toEqual(["2", "3", "1"]);
    });

    test("debe mover una tarea de una posición a otra (atrás)", () => {
      const result = reorderTasks(tasks, 2, 0);
      expect(result.map((t) => t.id)).toEqual(["3", "1", "2"]);
    });

    test("debe devolver el mismo array si los índices de origen y destino son iguales", () => {
      const result = reorderTasks(tasks, 1, 1);
      expect(result.map((t) => t.id)).toEqual(["1", "2", "3"]);
      expect(result).not.toBe(tasks);
    });
  });

  describe("getIndicators", () => {
    const financial: Financial = {
      current: {
        dolar: 950.5,
        utm: 65182,
        btc: 60000000,
        eth: 3000000,
      },
      history: [],
    };

    test("debe mapear el objeto Financial a un array de Indicator", () => {
      const indicators: Indicator[] = getIndicators(financial);
      expect(indicators).toHaveLength(4);

      expect(indicators[0]).toEqual({
        label: "Dólar",
        value: 950.5,
        key: "dolar",
      });
      expect(indicators[1]).toEqual({ label: "UTM", value: 65182, key: "utm" });
      expect(indicators[2]).toEqual({
        label: "BTC",
        value: 60000000,
        key: "btc",
      });
      expect(indicators[3]).toEqual({
        label: "ETH",
        value: 3000000,
        key: "eth",
      });
    });
  });

  describe("mapSparklineData", () => {
    const history: FinancialHistory[] = [
      {
        created_at: "2023-10-01",
        dolar: 900,
        utm: 60000,
        btc: 50000000,
        eth: 2000000,
      },
      {
        created_at: "2023-10-02",
        dolar: 910,
        utm: 61000,
        btc: 55000000,
        eth: 2500000,
      },
    ];

    test("debe mapear el array FinancialHistory a un formato adecuado para Sparkline", () => {
      const sparklineData = mapSparklineData(history);
      expect(sparklineData).toHaveLength(2);

      expect(sparklineData[0]).toEqual({
        date: "2023-10-01",
        dolar: 900,
        utm: 60000,
        btc: 50000000,
        eth: 2000000,
      });

      expect(sparklineData[1]).toEqual({
        date: "2023-10-02",
        dolar: 910,
        utm: 61000,
        btc: 55000000,
        eth: 2500000,
      });
    });
  });

  describe("getTrend", () => {
    const historyUp: OrderedFinancialHistory = [
      {
        created_at: "D1",
        dolar: 900,
        utm: 0,
        btc: 0,
        eth: 0,
      },
      {
        created_at: "D2",
        dolar: 910,
        utm: 0,
        btc: 0,
        eth: 0,
      },
    ];
    const historyDown: OrderedFinancialHistory = [
      {
        created_at: "D1",
        dolar: 910,
        utm: 0,
        btc: 0,
        eth: 0,
      },
      {
        created_at: "D2",
        dolar: 900,
        utm: 0,
        btc: 0,
        eth: 0,
      },
    ];
    const historySame: OrderedFinancialHistory = [
      {
        created_at: "D1",
        dolar: 900,
        utm: 0,
        btc: 0,
        eth: 0,
      },
      {
        created_at: "D2",
        dolar: 900,
        utm: 0,
        btc: 0,
        eth: 0,
      },
    ];
    const historySingle: OrderedFinancialHistory = [
      {
        created_at: "D1",
        dolar: 900,
        utm: 0,
        btc: 0,
        eth: 0,
      },
    ];
    const historyEmpty: OrderedFinancialHistory = [];

    const historyInvalid: OrderedFinancialHistory = [
      { created_at: "", dolar: 900, utm: 0, btc: 0, eth: 0 },
      { created_at: undefined as any, dolar: 910, utm: 0, btc: 0, eth: 0 },
    ];
    const historyFirstZero: OrderedFinancialHistory = [
      { created_at: "D1", dolar: 0, utm: 0, btc: 0, eth: 0 },
      { created_at: "D2", dolar: 100, utm: 0, btc: 0, eth: 0 },
    ];

    test("debe devolver 'up' si el valor más reciente es mayor que el anterior", () => {
      expect(getTrend(historyUp, "dolar")).toBe("up");
    });

    test("debe devolver 'down' si el valor más reciente es menor que el anterior", () => {
      expect(getTrend(historyDown, "dolar")).toBe("down");
    });

    test("debe devolver 'flat' si los dos últimos valores son iguales", () => {
      expect(getTrend(historySame, "dolar")).toBe("flat");
    });

    test("debe devolver null si el historial tiene created_at inválido", () => {
      expect(getTrend(historyInvalid, "dolar")).toBeNull();
    });

    test("debe devolver null si el historial tiene menos de 2 elementos", () => {
      expect(getTrend(historySingle, "dolar")).toBeNull();
      expect(getTrend(historyEmpty, "dolar")).toBeNull();
    });
    test("debe devolver null si el primer valor de la key es 0", () => {
      expect(getTrend(historyFirstZero, "dolar")).toBeNull();
    });
  });

  describe("handleTextChange", () => {
    const setNoteMock = jest.fn();
    const saveNoteMock = jest.fn();
    const mockEvent = (value: string) =>
      ({
        target: { value },
      }) as React.ChangeEvent<HTMLTextAreaElement>;

    test("debe llamar a setNote y saveNote con el valor del textarea", () => {
      const value = "Nueva nota de prueba";
      handleTextChange(mockEvent(value), setNoteMock, saveNoteMock);

      expect(setNoteMock).toHaveBeenCalledWith(value);
      expect(saveNoteMock).toHaveBeenCalledWith(value);
    });

    test("debe manejar un valor vacío", () => {
      const value = "";
      handleTextChange(mockEvent(value), setNoteMock, saveNoteMock);

      expect(setNoteMock).toHaveBeenCalledWith(value);
      expect(saveNoteMock).toHaveBeenCalledWith(value);
    });
  });

  describe("formatFechaHora", () => {
    const date = new Date("2024-11-20T14:30:45.000Z");

    test("debe formatear correctamente la fecha y hora a 'es-CL'", () => {
      const result = formatFechaHora(date);
      expect(result.fecha).toMatch(/^\d{1,2} de [a-záéúóíñ]+ de \d{4}$/);
      expect(result.hora).toMatch(/^\d{2}:\d{2}:\d{2}$/);

      const expectedDatePart = "20 de noviembre de 2024";
      expect(result.fecha).toContain(expectedDatePart.substring(0, 10));
    });
  });

  describe("formatPromptOutput", () => {
    const data: PromptData = {
      title: "  Título de prueba  ",
      objective: "  Objetivo claro  ",
      instructions: "  Instrucción 1. Instrucción 2.  ",
      context: "  Contexto relevante.  ",
      examples: ["  Ejemplo A  ", " Ejemplo B "],
      expected_output: "  Salida JSON esperada.  ",
    };

    test("debe formatear los datos de PromptData en un string multilinea limpiando los espacios en blanco", () => {
      const expectedOutput = `Título: Título de prueba
  Objetivo: Objetivo claro
  Instrucciones: Instrucción 1. Instrucción 2.
  Contexto: Contexto relevante.
  Ejemplos: Ejemplo A, Ejemplo B
  Resultado esperado: Salida JSON esperada.`;

      expect(formatPromptOutput(data)).toBe(expectedOutput);
    });

    test("debe manejar arrays de ejemplos vacíos", () => {
      const dataEmptyExamples: PromptData = { ...data, examples: [] };
      const result = formatPromptOutput(dataEmptyExamples);
      expect(result).toContain("Ejemplos: ");
      expect(result).not.toContain(", ");
    });
  });
});

describe("roundToThousands", () => {
  // Caso 1: Redondeo hacia arriba (ej. 1500 -> 2000)
  test("debería redondear hacia el múltiplo de mil superior", () => {
    // 1500 / 1000 = 1.5. Math.round(1.5) = 2. 2 * 1000 = 2000
    expect(roundToThousands(1500)).toBe(2000);
  });

  // Caso 2: Redondeo hacia abajo (ej. 1499 -> 1000)
  test("debería redondear hacia el múltiplo de mil inferior", () => {
    // 1499 / 1000 = 1.499. Math.round(1.499) = 1. 1 * 1000 = 1000
    expect(roundToThousands(1499)).toBe(1000);
  });

  // Caso 3: Número exacto (ej. 3000 -> 3000)
  test("debería devolver el mismo número si ya es un múltiplo de mil", () => {
    // 3000 / 1000 = 3. Math.round(3) = 3. 3 * 1000 = 3000
    expect(roundToThousands(3000)).toBe(3000);
  });

  // Caso 4: Número grande
  test("debería manejar números grandes correctamente", () => {
    // 1234567 / 1000 = 1234.567. Math.round = 1235. 1235 * 1000 = 1235000
    expect(roundToThousands(1234567)).toBe(1235000);
  });

  // Caso 5: Número pequeño / cero
  test("debería devolver 0 para números muy pequeños o cero", () => {
    expect(roundToThousands(0)).toBe(0);
    expect(roundToThousands(499)).toBe(0); // Redondeo hacia abajo a 0
    expect(roundToThousands(500)).toBe(1000); // Redondeo hacia arriba a 1000
  });

  // Caso 6: Manejo de no-números (debe devolver 0)
  test("debería devolver 0 si el valor no es un número", () => {
    // @ts-ignore: Intencionalmente pasando un tipo incorrecto para testear la validación
    expect(roundToThousands("cien")).toBe(0);
    // @ts-ignore: Intencionalmente pasando un tipo incorrecto
    expect(roundToThousands(null)).toBe(0);
    // @ts-ignore: Intencionalmente pasando un tipo incorrecto
    expect(roundToThousands(undefined)).toBe(0);
  });

  // Caso 7: Manejo de valores no finitos (debe devolver 0)
  test("debería devolver 0 si el valor no es finito (NaN, Infinity)", () => {
    expect(roundToThousands(NaN)).toBe(0);
    expect(roundToThousands(Infinity)).toBe(0);
    expect(roundToThousands(-Infinity)).toBe(0);
  });
});
