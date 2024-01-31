import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HBRComponentResolver from './HBRComponentResolver';

const CustomTestComponent = jest.fn(() => (
    <div data-testid="mock-custom-component">Custom Test Component</div>
));

describe('HBRComponentResolver', () => {
    it('renders default variation when no override is provided', () => {
        const ResolvedComponent = HBRComponentResolver();
        render(<ResolvedComponent type="promo" />);

        expect(
            screen.getByText('Package HBRComponent Rendered'),
        ).toBeInTheDocument();
    });

    it('renders custom variation when an override is provided', () => {
        const ResolvedComponent = HBRComponentResolver({
            promo: CustomTestComponent,
        });
        render(<ResolvedComponent type="promo" />);

        expect(screen.getByTestId('mock-custom-component')).toBeInTheDocument();
        expect(CustomTestComponent).toHaveBeenCalled();
    });
});
