import { DataProvider } from "@/context/DataContext";
import { render, screen, within } from "@testing-library/react";
import { TopSites } from "@/components/TopSites";
import { TopSite, TopSitesProps } from "@/types";


const mockTopSites: TopSite[] = [
    {
        id: "1", titulo: "Google", url: "http://www.google.cl",
        hits: 0
    },
    {
        id: "2", titulo: "Gmail", url: "http://www.gmail.com",
        hits: 0
    }
];

const defaultProps: TopSitesProps = {
    topSites: mockTopSites,
    updateHitSite: jest.fn()
}

describe('TopSites Componente', () => {

    it("renders Skeleton when topSites is not a valid Array", () => {
        render(
            <DataProvider>
                <TopSites {...defaultProps} topSites={"" as unknown as TopSite[]} />
            </DataProvider>
        );
        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it('renders all TopSites passed via props', () => {
        render(
            <DataProvider>
                <TopSites {...defaultProps} />
            </DataProvider>
        )        
        expect(screen.getByText("Top Sites")).toBeInTheDocument();
        const totalHits = defaultProps.topSites.reduce((acc, page) => acc + page.hits, 0);
        defaultProps.topSites.forEach((site) => {
            const percentage = totalHits > 0 ? (site.hits / totalHits) * 100 : 0;
            const titulo = screen.getByText(site.titulo);
            expect(titulo).toBeInTheDocument();
            const li = titulo.closest("li");
            expect(li).not.toBeNull();
            within(li as HTMLElement).findByText(`${percentage.toFixed(1)}%`);
            expect(titulo.closest("a")).toHaveAttribute("href", site.url);
        });

    });
})