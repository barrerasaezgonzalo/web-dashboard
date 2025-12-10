import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "@/app/page";
import Masonry from "react-masonry-css";

// Mock de useData
jest.mock("@/hooks/useData", () => ({
  useData: () => ({
    financial: [],
    news: [],
    tasks: [],
    addTask: jest.fn(),
    removeTask: jest.fn(),
    editTask: jest.fn(),
    toggleTaskInDev: jest.fn(),
    updateTasksOrder: jest.fn(),
    clima: "Santiago",
    getPrompt: jest.fn(),
    tasksLoading: false,
    financialLoading: false,
    user: "Gonza",
    topSites: [],
    updateHitSite: jest.fn(),
  }),
}));

// Mock de todos los componentes importados
const mockComponents = [
  "BackGround",
  "User",
  "Search",
  "Time",
  "NewsList",
  "TopSites",
  "Todo",
  "TasksPieChart",
  "Notes",
  "Financial",
  "Gpt",
  "Phrases",
  "Promts",
  "ProgressChecklist",
  "PerformancePanel",
  "ErrorBoundary",
];

mockComponents.forEach((comp) => {
  jest.mock(`@/components/${comp}`, () => ({
    __esModule: true,
    default: ({ children }: any) => <div data-testid={comp}>{children}</div>,
    ...(comp === "Phrases" ? { Phrases: ({ children }: any) => <div data-testid="Phrases">{children}</div> } : {}),
  }));
});

// Test
describe("App layout", () => {
  it("renders the main layout with Masonry and components", () => {
    render(<App />);

    // Contenedor principal
    expect(document.querySelector("div.relative.w-full.min-h-screen")).toBeInTheDocument();

    // Algunos componentes renderizados
    expect(screen.getByTestId("BackGround")).toBeInTheDocument();
    expect(screen.getByTestId("User")).toBeInTheDocument();
  });
});
