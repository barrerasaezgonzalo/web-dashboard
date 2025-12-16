import { render, waitFor } from "@testing-library/react";
import React, { useContext } from "react";
import {
  NewsProvider,
  NewsContext,
  NewsContextType,
  canAccessBrowserStorage,
  getBrowserWindow,
} from "@/context/NewsContext";

global.fetch = jest.fn();
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("NewsProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test("getNews actualiza news y newsLoading", async () => {
    const mockData = {
      totalArticles: 2,
      articles: [{ title: "A" }, { title: "B" }],
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    let contextValue: NewsContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(NewsContext);
      return null;
    };

    render(
      <NewsProvider>
        <TestComponent />
      </NewsProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.newsLoading).toBe(false);
      expect(contextValue?.news).toEqual(mockData);
    });
    expect(fetch).toHaveBeenCalledWith("/api/news");
  });

  test("getNews maneja error y setea fallback", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    let contextValue: NewsContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(NewsContext);
      return null;
    };

    render(
      <NewsProvider>
        <TestComponent />
      </NewsProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.newsLoading).toBe(false);
      expect(contextValue?.news._fallback).toBe(true);
    });
  });

  test("getNews carga desde cache si existe y válida", async () => {
    const cachedData = { totalArticles: 1, articles: [{ title: "Cached" }] };
    const futureTime = (Date.now() + 1000).toString();
    localStorage.setItem("newsCache", JSON.stringify(cachedData));
    localStorage.setItem("newsCacheTime", futureTime);

    let contextValue: NewsContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(NewsContext);
      return null;
    };

    render(
      <NewsProvider>
        <TestComponent />
      </NewsProvider>,
    );

    await waitFor(() => {
      expect(contextValue?.news).toEqual(cachedData);
    });
  });

  test("bloquearNews12Horas limpia cache y llama a getNews", async () => {
    const mockData = { totalArticles: 0, articles: [] };
    (fetch as jest.Mock).mockResolvedValueOnce({ json: async () => mockData });

    let contextValue: NewsContextType | undefined;
    const TestComponent = () => {
      contextValue = useContext(NewsContext);
      return null;
    };

    render(
      <NewsProvider>
        <TestComponent />
      </NewsProvider>,
    );

    await waitFor(() => expect(contextValue?.news).toEqual(mockData));

    contextValue?.bloquearNews12Horas();

    await waitFor(() => {
      expect(contextValue?.news).toEqual(mockData);
    });

    expect(localStorage.getItem).toHaveBeenCalledWith("newsCacheTime");
  });

  describe("canAccessBrowserStorage", () => {
    test("retorna false cuando no hay window (SSR)", () => {
      expect(canAccessBrowserStorage(undefined)).toBe(false);
    });

    test("retorna true cuando hay window", () => {
      expect(canAccessBrowserStorage({})).toBe(true);
    });
  });
});
