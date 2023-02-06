import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cart, { CartTestIds } from './Cart';
import styles from './Cart.module.scss';

const mockItems = [
    {
        name: 'test product',
        url: 'www.test.com',
        quantity: 1,
        sale_price: 20,
    },
    {
        name: 'test product 2',
        url: 'www.test.com',
        quantity: 1,
        sale_price: 20,
    },
];
const mockTotal = 20;

describe('<Cart /> component', () => {
    it('content should show and hide', async () => {
        const { rerender } = render(
            <Cart
                show={false}
                items={mockItems}
                totalCartAmount={mockTotal}
                onClose={() => {}}
            />
        );
        expect(screen.getByTestId(CartTestIds.MENU_CONTENT)).toHaveClass(
            styles['opacity-0']
        );

        rerender(
            <Cart
                show
                items={mockItems}
                totalCartAmount={mockTotal}
                onClose={() => {}}
            />
        );
        expect(screen.getByTestId(CartTestIds.MENU_CONTENT)).not.toHaveClass(
            styles.active
        );
        await waitFor(() => {
            expect(screen.getByTestId(CartTestIds.MENU_CONTENT)).toHaveClass(
                styles['fade-in-flyout--links']
            );
        });

        rerender(
            <Cart
                show={false}
                items={mockItems}
                totalCartAmount={mockTotal}
                onClose={() => {}}
            />
        );
        await waitFor(
            () => {
                expect(
                    screen.getByTestId(CartTestIds.MENU_CONTENT)
                ).toHaveClass(styles['fadeout-flyout--links']);
                expect(
                    screen.getByTestId(CartTestIds.MENU_CONTENT)
                ).toHaveClass(styles['opacity-0']);
            },
            { timeout: 1000 }
        );
    });

    it('show render correct number of cart items', () => {
        render(
            <Cart
                show={false}
                items={mockItems}
                totalCartAmount={mockTotal}
                onClose={() => {}}
            />
        );
        expect(screen.getAllByRole('listitem').length).toBe(mockItems.length);
    });
});
