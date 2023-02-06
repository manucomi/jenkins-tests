import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import noop from 'Helpers/noop/noop';
import useAuthStore from 'Stores/auth/auth.store';
import useUserStore from 'Stores/user/user.store';
import MegaMenu, { MegaMenuTestIds } from './MegaMenu';
import useMegaMenuStore from './MegaMenu.store';
import styles from './MegaMenu.module.scss';

const hmmTestGroupUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BST',
        subscriberPremiums: [
            {
                premiumCode: 'HMMTESTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const learningSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BSTL',
        subscriberPremiums: [
            {
                premiumCode: 'DEFAULTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const nonLearningSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BST',
        subscriberPremiums: [
            {
                premiumCode: 'DEFAULTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const nonSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
};

jest.mock('./SearchForm/AutoSuggest/AutoSuggest', () => {
    return {
        __esModule: true,
        default: function autoSuggestMock() {
            return <div />;
        },
    };
});

describe('<MegaMenu /> component', () => {
    it('should show and hide', async () => {
        const { rerender } = render(
            <MegaMenu
                onClose={noop}
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        expect(screen.getByRole('navigation')).not.toHaveClass(styles.visible);

        rerender(
            <MegaMenu
                handleSignInClick={noop}
                handleLogout={noop}
                onClose={noop}
                show
            />
        );
        expect(screen.getByRole('navigation')).toHaveClass(styles.visible);

        rerender(
            <MegaMenu
                handleSignInClick={noop}
                handleLogout={noop}
                onClose={noop}
                show={false}
            />
        );
        await waitFor(
            () => {
                expect(screen.getByRole('navigation')).not.toHaveClass(
                    styles.visible
                );
            },
            { timeout: 1500 }
        );
    });

    it('should fire the onClose method', async () => {
        const onClose = jest.fn();
        render(
            <MegaMenu
                onClose={onClose}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );

        await userEvent.click(
            screen.getByRole('button', { name: /^close the main/i })
        );
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close the modal on pressing escape key', async () => {
        const onClose = jest.fn();
        render(
            <MegaMenu
                onClose={onClose}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );

        await userEvent.type(screen.getByRole('navigation'), '{space}');
        expect(onClose).not.toHaveBeenCalled();

        await userEvent.type(screen.getByRole('navigation'), '{escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should give focus to the search field', async () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('searchbox')).toHaveFocus();
        });
    });

    it('should react when auto suggestions appear', () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        expect(useMegaMenuStore.getState().isAutoSuggestOpen).toBeFalsy();

        act(() => {
            useMegaMenuStore.setState({ isAutoSuggestOpen: true });
        });
        expect(
            screen.getByTestId(MegaMenuTestIds.LONG_LISTS_CONTAINER)
        ).toHaveClass(styles['auto-suggest-open']);
    });

    it('should show login button if unauthenticated and call the login callback.', async () => {
        const onLoginClick = jest.fn();
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={onLoginClick}
                handleLogout={noop}
            />
        );
        expect(
            screen.queryAllByRole('button', { name: 'Sign In' })[0]
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getAllByRole('button', { name: /Sign In/i })[0]
        );

        expect(onLoginClick).toHaveBeenCalledTimes(1);
    });

    it('should show logout button if authenticated and call the logout callback', async () => {
        const onLogoutClick = jest.fn();
        useAuthStore.getState().setIsAuthenticated(true);

        render(
            <MegaMenu
                onClose={noop}
                show
                handleLogout={onLogoutClick}
                handleSignInClick={noop}
            />
        );
        expect(
            screen.queryAllByRole('button', { name: 'Log Out' })[0]
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getAllByRole('button', { name: /Log Out/i })[0]
        );
        expect(onLogoutClick).toHaveBeenCalledTimes(1);
    });

    it('should hide the HMM link for non subscribers', () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        act(() => {
            useUserStore.getState().setProfile(nonSubscriberUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).not.toBeInTheDocument();
    });

    it('should hide the HMM link for non-learning subscribers', () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        act(() => {
            useUserStore
                .getState()
                .setProfile(nonLearningSubscriberUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).not.toBeInTheDocument();
    });

    it('should display the HMM link for HMM test group users', () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        act(() => {
            useUserStore.getState().setProfile(hmmTestGroupUserProfile);
        });
        expect(screen.queryAllByText(/HBR Learning/)).toHaveLength(2);
        expect(screen.queryAllByText(/HBR Learning/)[0]).toBeInTheDocument();
    });

    it('should display the HMM link for learning subscribers', () => {
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        act(() => {
            useUserStore.getState().setProfile(learningSubscriberUserProfile);
        });
        expect(screen.queryAllByText(/HBR Learning/)).toHaveLength(2);
        expect(screen.queryAllByText(/HBR Learning/)[0]).toBeInTheDocument();
    });
    it('should render the subscriptions link', async () => {
        useUserStore.getState().setProfile(null);
        render(
            <MegaMenu
                onClose={noop}
                show
                handleSignInClick={noop}
                handleLogout={noop}
            />
        );
        expect(
            screen.getAllByRole('link', { name: 'Subscribe' })[0]
        ).toHaveAttribute(
            'href',
            expect.stringContaining('/subscriptions?ab=')
        );
    });
});
