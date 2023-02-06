import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import noop from 'Helpers/noop/noop';
import HeaderMenu from './HeaderMenu';

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

describe('<HeaderMenu /> component', () => {
    it('should render show and hide when the prop is toggled', async () => {
        const { rerender } = render(
            <HeaderMenu
                show
                items={mockItems}
                total={mockTotal}
                onClose={noop}
                label="Mock Menu"
            >
                Header menu content
            </HeaderMenu>
        );
        expect(screen.getByRole('region')).toHaveClass('active');

        rerender(
            <HeaderMenu
                show={false}
                items={mockItems}
                total={mockTotal}
                onClose={noop}
                label="Mock Menu"
            >
                Header menu content
            </HeaderMenu>
        );
        await waitFor(() => {
            expect(screen.getByRole('region')).not.toHaveClass('active');
        });
    });

    it('should fire the onClose method', async () => {
        const onClose = jest.fn();
        render(
            <HeaderMenu onClose={onClose} show label="Mock Menu">
                Header menu content
            </HeaderMenu>
        );

        await userEvent.click(document.body);
        expect(onClose).toHaveBeenCalledTimes(1);

        onClose.mockClear();

        await userEvent.click(
            screen.getByRole('button', { name: /Close the header menu/ })
        );
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close menu on pressing escape key', async () => {
        const onClose = jest.fn();
        render(
            <HeaderMenu onClose={onClose} show label="Mock Menu">
                Header menu content
            </HeaderMenu>
        );

        await userEvent.type(screen.getByRole('region'), '{space}');
        expect(onClose).not.toHaveBeenCalled();

        await userEvent.type(screen.getByRole('region'), '{escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
