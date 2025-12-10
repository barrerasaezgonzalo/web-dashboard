import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

describe("Error Boundary Component", () => {

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders children when no error occurs", () => {
        render(
            <ErrorBoundary>
                <div>Contenido Seguro</div>
            </ErrorBoundary>
        );
        expect(screen.getByText("Contenido Seguro")).toBeInTheDocument();
    });

    it('renders fallback UI when a child throws an error', () => {

        const ProblemChild = () => {
            throw new Error("Boom!");
        };
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(
            screen.getByText("Ocurrió un error cargando este componente.")
        ).toBeInTheDocument();

        expect(screen.getByText("Boom!")).toBeInTheDocument();
    })

    it("allows retry and re-renders children after error reset", async () => {

        let shouldThrow = true;
        const ProblemChild = () => {
            if (shouldThrow) {
                throw new Error("Boom!");
            }
            return <div>Contenido Recuperado</div>;
        };
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(
            screen.getByText("Ocurrió un error cargando este componente.")
        ).toBeInTheDocument();
        expect(screen.getByText("Boom!")).toBeInTheDocument();

        shouldThrow = false;

        const button = screen.getByText("Reintentar");
        button.click();
        expect(await screen.findByText('Contenido Recuperado'));

    });

});