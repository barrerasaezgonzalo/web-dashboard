import { UserProvider, useUser } from "@/context/UserContext";
import { render, waitFor, screen } from "@testing-library/react";

jest.mock("@/lib/supabaseClient", () => {
  const mockUnsubscribe = jest.fn();

  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: {
            subscription: {
              unsubscribe: mockUnsubscribe,
            },
          },
        }),
      },
    },
  };
});

describe("UserContext", () => {
  test("expone usuario null y loading false cuando no hay sesión", async () => {
    const TestConsumer = () => {
      const { userId, userName, loading } = useUser();
      return (
        <div>
          <span data-testid="userId">{String(userId)}</span>
          <span data-testid="userName">{String(userName)}</span>
          <span data-testid="loading">{String(loading)}</span>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("userId").textContent).toBe("null");
      expect(screen.getByTestId("userName").textContent).toBe("null");
    });
  });
});
