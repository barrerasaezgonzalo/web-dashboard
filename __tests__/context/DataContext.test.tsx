import React, { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DataProvider, DataContext } from "@/context/DataContext";

beforeAll(() => {
    // Mock fetch
    (global as any).fetch = jest.fn();

    // Mock localStorage
    let store: Record<string, string> = {};
    const localStorageMock = {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: jest.fn((key: string) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
    };

    Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
    });
});

// Mock fetch global
beforeEach(() => {
    jest.clearAllMocks();

    (global as any).fetch.mockImplementation((url: string, options?: any) => {
        if (url === "/api/tasks/get") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([{ id: "1", title: "Test Task", order: 0, in_dev: false }]),
            });
        }
        if (url === "/api/tasks/edit" && options?.method === "PATCH") {
            const body = JSON.parse(options.body);
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ ...body }),
            });
        }
        if (url === "/api/news") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ totalArticles: 1, articles: [{ title: "Test News" }] }),
            });
        }
        if (url === "/api/financial") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        current: { dolar: 1000, utm: 50, btc: 20000, eth: 1500 },
                        history: [],
                    }),
            });
        }
        if (url === "/api/weather") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ temperatura: "25°C" }),
            });
        }
        if (url === "/api/note") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ content: "Test Note" }),
            });
        }
        if (url === "/api/sites") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ id: "site1", titulo: "Site 1", hits: 0 }]),
            });
        }
        if (url === "/api/tasks/reorder") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        if (url.startsWith("/api/tasks/") && options?.method === "DELETE") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("DataProvider", () => {
    it("provides context values after fetching data", async () => {
        let contextValue: any;

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => {
            expect(contextValue.tasks.length).toBeGreaterThan(0);
            expect(contextValue.news.totalArticles).toBe(1);
            expect(contextValue.financial.current.dolar).toBe(1000);
            expect(contextValue.clima).toBe("25°C");
            expect(contextValue.note).toBe("Test Note");
            expect(contextValue.topSites.length).toBe(1);
        });
    });

    it("addTask updates tasks", async () => {
        let contextValue: any;

        (global as any).fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([{ id: "2", title: "New Task", order: 1 }]),
            })
        );

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => contextValue.addTask("New Task"));
        await waitFor(() => {
            expect(contextValue.tasks.find((t: any) => t.title === "New Task")).toBeTruthy();
        });
    });

    it("removes old newsCache from localStorage", async () => {
        const pastTime = Date.now() - 13 * 60 * 60 * 1000;
        localStorage.setItem("newsCache", JSON.stringify({ totalArticles: 1, articles: [] }));
        localStorage.setItem("newsCacheTime", pastTime.toString());

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => <div>Test</div>}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => {
            expect(localStorage.removeItem).toHaveBeenCalledWith("newsCache");
            expect(localStorage.removeItem).toHaveBeenCalledWith("newsCacheTime");
        });
    });

    it("updates a task when editTask is called", async () => {
        let contextValue: any;

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => {
            expect(contextValue.tasks.length).toBe(1);
            expect(contextValue.tasks[0].title).toBe("Test Task");
        });

        await contextValue.editTask("1", "Updated Task");

        await waitFor(() => {
            expect(contextValue.tasks[0].title).toBe("Updated Task");
        });
    });

    it("removes a task when removeTask is called", async () => {
        let contextValue: any;

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => {
            expect(contextValue.tasks.length).toBe(1);
        });

        await contextValue.removeTask("1");

        await waitFor(() => {
            expect(contextValue.tasks.length).toBe(0);
        });
    });

    it("toggles in_dev property when toggleTaskInDev is called", async () => {
        let contextValue: any;

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        await waitFor(() => {
            expect(contextValue.tasks[0].in_dev).toBe(false);
        });

        await contextValue.toggleTaskInDev("1");

        await waitFor(() => {
            expect(contextValue.tasks[0].in_dev).toBe(true);
        });

        await contextValue.toggleTaskInDev("1");

        await waitFor(() => {
            expect(contextValue.tasks[0].in_dev).toBe(false);
        });
    });

    it("updates tasks order when updateTasksOrder is called", async () => {
        let contextValue: any;

        (global as any).fetch.mockImplementation((url: string) => {
            if (url === "/api/tasks/reorder") {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
            }
            if (url === "/api/tasks/get") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([{ id: "1", title: "Test Task", order: 0 }]),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        });

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        // Esperar que se carguen las tasks iniciales
        await waitFor(() => {
            expect(contextValue.tasks.length).toBeGreaterThan(0);
        });

        const newTasks = [{ id: "1", title: "Second Task", order: 0 }];

        await waitFor(async () => {
            await contextValue.updateTasksOrder(newTasks);
        });

        // Ahora sí debería estar actualizado
        expect(contextValue.tasks[0].title).toBe("Second Task");
    });


    it("getPrompt sets prompt and returns data", async () => {
        let contextValue: any;

        // Mock fetch solo para /api/promt
        (global as any).fetch.mockImplementation((url: string) => {
            if (url === "/api/promt") {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: "Generated Prompt" }),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        });

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        // Llamar a getPrompt y esperar la actualización del estado
        let result: string | null = null;
        await waitFor(async () => {
            result = await contextValue.getPrompt("test input");
            expect(result).toBe("Generated Prompt");
            expect(contextValue.prompt).toBe("Generated Prompt");
        });
    });



    it("getPrompt returns null if input is empty", async () => {
        let contextValue: any;

        render(
            <DataProvider>
                <DataContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return <div>Test</div>;
                    }}
                </DataContext.Consumer>
            </DataProvider>
        );

        const result = await contextValue.getPrompt("");

        expect(result).toBeNull();
        expect(contextValue.prompt).toBe("");
    });

});
