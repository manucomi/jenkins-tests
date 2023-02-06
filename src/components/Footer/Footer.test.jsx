import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import useUserStore from 'Stores/user/user.store';
import Footer from './Footer';

afterEach(() => {
    useUserStore.getState().deleteProfile();
});

describe('<Footer /> component', () => {
    it('should open link', () => {
        render(<Footer />);
        expect(screen.getAllByText(/Most Popular/i)[0]).toHaveAttribute(
            'href',
            '/most-popular'
        );
    });

    it('should open and close the sign in modal', async () => {
        render(<Footer />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await userEvent.click(
            screen.getAllByRole('button', { name: /Orders/i })[0]
        );
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        await userEvent.click(document.body);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should not render the gift a sub message', () => {
        render(<Footer />);
        expect(screen.getByText('Start my subscription!')).toBeInTheDocument();
    });
    it('should render the gift a sub message when the user is a subscriber', () => {
        useUserStore
            .getState()
            .setProfile({ subscriber: { subscriptions: [{ name: 'ABC' }] } });
        render(<Footer />);
        expect(screen.getByText('Give a Gift!')).toBeInTheDocument();
    });
    it('should add targets to the URL', () => {
        render(<Footer />);
        const link = screen.getByText('Start my subscription!');
        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('?ab=footer-subtout')
        );
        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('&tpcc=houseads.site.footer-subtout')
        );
    });
    it('should send subscribers to the gift URL', () => {
        useUserStore
            .getState()
            .setProfile({ subscriber: { subscriptions: [{ name: 'ABC' }] } });
        render(<Footer />);
        const link = screen.getByText('Give a Gift!');

        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('gift-subscriptions')
        );
    });
    it('should send non subscribers to the subscribe URL', () => {
        render(<Footer />);
        const link = screen.getByText('Start my subscription!');

        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('/subscriptions')
        );
        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('?ab=footer-subtout')
        );
        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining('&tpcc=houseads.site.footer-subtout')
        );
    });
});
