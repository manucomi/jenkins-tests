import React from 'react';
import { act, render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import UserService from 'Services/UserService/UserService';
import noop from 'Helpers/noop/noop';
import useUserStore from 'Stores/user/user.store';
import UserMenu from './UserMenu';
import styles from './UserMenu.module.scss';

jest.mock('Services/UserService/UserService');
jest.mock('Domains/DataLayer/DataLayer', () => {
    return function mockDataLayer() {
        return { init: () => Promise.resolve(), updateUsers: jest.fn() };
    };
});

const userProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const handleLogout = jest.fn();

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(noop);
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('<Usermenu /> component', () => {
    it('should show and hide the content', async () => {
        const { rerender } = render(
            <UserMenu show={false} onClose={noop} handleLogout={handleLogout} />
        );
        expect(
            screen.getByRole('navigation', { name: /User Menu links/ })
        ).toHaveClass(styles['opacity-0']);

        rerender(<UserMenu onClose={noop} show handleLogout={handleLogout} />);
        expect(
            screen.queryByRole('navigation', { name: /User Menu links/ })
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(
                screen.getByRole('navigation', { name: /User Menu links/ })
            ).toHaveClass(styles['fade-in-flyout--links']);
        });

        rerender(
            <UserMenu onClose={noop} show={false} handleLogout={handleLogout} />
        );
        await waitFor(
            () => {
                expect(
                    screen.getByRole('navigation', { name: 'User Menu links' })
                ).toHaveClass(styles['fadeout-flyout--links']);
                expect(
                    screen.getByRole('navigation', { name: 'User Menu links' })
                ).toHaveClass(styles['opacity-0']);
            },
            { timeout: 1000 }
        );
    });

    it('should display the subscriber type', () => {
        render(<UserMenu onClose={noop} show handleLogout={handleLogout} />);
        act(() => {
            useUserStore.getState().setProfile(userProfile);
        });
        expect(screen.queryByText(/Digital/)).toBeInTheDocument();
    });

    it('should call the logout handler on clicking logout button', async () => {
        UserService.logout.mockReturnValueOnce({ success: true });
        render(<UserMenu onClose={noop} show handleLogout={handleLogout} />);
        await userEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(handleLogout).toHaveBeenCalledTimes(1);
    });
});
