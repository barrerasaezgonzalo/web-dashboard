import React from 'react';
import { render, screen } from '@testing-library/react';
import BackGround from '@/components/ui/BackGround';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

describe('BackGround', () => {
    it('renders without crashing', () => {
        render(<BackGround />);
        const container = screen.getByAltText('Fondo');
        expect(container).toBeInTheDocument();
    });

    it('renders with correct image src', () => {
        render(<BackGround />);
        const image = screen.getByAltText('Fondo') as HTMLImageElement;
        expect(image.src).toContain('/bg.jpg');
    });

    it('renders wrapper div with correct classes', () => {
        const { container } = render(<BackGround />);
        const div = container.querySelector('div');
        expect(div).toHaveClass('absolute', 'top-0', 'left-0', 'w-full', 'h-full', '-z-10');
    });

    it('renders image with correct alt text', () => {
        render(<BackGround />);
        const image = screen.getByAltText('Fondo');
        expect(image).toBeInTheDocument();
    });    
});