import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import setupParser from './parseContent';

function CustomLinkComponent() {
    return (
        <span style={{ color: 'red' }} data-testid="mock-custom-link">
            custom link
        </span>
    );
}

function CustomPromoComponent() {
    return (
        <span style={{ color: 'red' }} data-testid="mock-custom-promo">
            custom promo component
        </span>
    );
}

describe('parseContent', () => {
    it('renders HTML parsed content with default configurations', () => {
        const sourceHTML = '<h1>Hello world</h1>';
        const parseContent = setupParser();

        render(parseContent(sourceHTML));

        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders content with custom link resolver', () => {
        const sourceHTML = '<a href="https://example.com">Example Link</a>';
        const customResolvers = {
            a: CustomLinkComponent,
        };
        const parseContent = setupParser({ customResolvers });

        render(parseContent(sourceHTML));

        expect(screen.getByTestId('mock-custom-link')).toBeInTheDocument();
    });

    it('renders hbr-component with custom promo component', () => {
        const sourceHTML = '<hbr-component type="promo" />';
        const hbrComponentOverrides = {
            promo: CustomPromoComponent,
        };
        const parseContent = setupParser({ hbrComponentOverrides });

        render(parseContent(sourceHTML));

        expect(screen.getByTestId('mock-custom-promo')).toBeInTheDocument();
    });
});
