import { render, waitFor } from "@testing-library/react";
import React, { useContext } from "react";
import {
  FinancialProvider,
  FinancialContext,
} from "@/context/FinancialContext";

describe("FinancialContext", () => {
  let fetchMock: jest.Mock;

  beforeAll(() => {
    fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({
        current: { dolar: 1000, utm: 50, btc: 20000, eth: 1500 },
        history: [],
      }),
    });
    (global as any).fetch = fetchMock;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("getFinancial actualiza el estado", async () => {
    let contextValue: any;
    const TestComponent = () => {
      contextValue = useContext(FinancialContext);
      return null;
    };

    render(
      <FinancialProvider>
        <TestComponent />
      </FinancialProvider>,
    );

    await waitFor(async () => {
      await contextValue.getFinancial();
      expect(contextValue.financial.current.dolar).toBe(1000);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/financial");
  });
});
