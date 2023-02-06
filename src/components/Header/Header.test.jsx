import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import CartService from 'Services/CartService/CartService';
import UserService from 'Services/UserService/UserService';
import GeoLocationService from 'Services/GeoLocationService/GeoLocationService';
import DataLayerService from 'Services/DataLayerService/DataLayerService';
import useAdConsent from 'Hooks/useAdConsent/useAdConsent';
import useAuthStore from 'Stores/auth/auth.store';
import useUserStore from 'Stores/user/user.store';
import renderForSWR from '../../test-helpers/renderForSWR/renderForSWR';
import Header, { HeaderTestIds } from './Header';
import styles from './Header.module.scss';

jest.mock('./MegaMenu/MegaMenu', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function megaMenuMock({ show, onClose }) {
            const logout = jest.fn();
            return show ? (
                <nav>
                    <button onClick={onClose} type="button">
                        close
                    </button>
                    <button onClick={logout} type="button">
                        megamenu logout
                    </button>
                </nav>
            ) : null;
        },
    };
});

jest.mock('Hooks/useAdConsent/useAdConsent');
jest.mock('Services/CartService/CartService');
jest.mock('Services/UserService/UserService');
jest.mock('Services/GeoLocationService/GeoLocationService');
jest.mock('Services/DataLayerService/DataLayerService');

beforeEach(() => {
    GeoLocationService.isUSUser.mockReturnValue(true);
});

const cartData = {
    cart: {
        line_items: {
            physical_items: [{ name: 'abc', amount: 100, url: 'hbr.org/abc' }],
            digital_items: [{ name: 'bcd', amount: 300, url: 'hbr.org/bcd' }],
        },
        cart_amount: 400,
    },
};

const scrollTo = (scrollPosition) => {
    window.pageYOffset = scrollPosition;
    window.dispatchEvent(new Event('scroll'));
};

beforeEach(() => {
    useAdConsent.mockReturnValue(true);
    CartService.getCart.mockReturnValue(cartData);
});

const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
);
const originalOffsetTop = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetTop'
);

afterEach(() => {
    useAuthStore.setState({ isAuthenticated: null });
    jest.resetAllMocks();
    Object.defineProperty(
        HTMLElement.prototype,
        'offsetHeight',
        originalOffsetHeight
    );
    Object.defineProperty(
        HTMLElement.prototype,
        'offsetTop',
        originalOffsetTop
    );
});

describe('<Header /> component', () => {
    it('should stick and unstick', async () => {
        await act(async () => renderForSWR(<Header />));

        await act(() => scrollTo(300));
        expect(screen.getByRole('banner')).toHaveClass(styles.sticky);

        await act(() => scrollTo(0));
        expect(screen.getByRole('banner')).not.toHaveClass(styles.sticky);
    });
    it('should stick and unstick on large viewports', async () => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            value: 100,
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
            configurable: true,
            value: 0,
        });
        renderForSWR(<Header />);

        await act(() => scrollTo(300));
        expect(screen.getByRole('banner')).toHaveClass(styles.sticky);

        await act(() => scrollTo(0));
        expect(screen.getByRole('banner')).not.toHaveClass(styles.sticky);
    });

    it('should show and hide the placeholder', async () => {
        const placeholderClass = styles['placeholder-visible'];
        await act(async () => renderForSWR(<Header />));
        const placeholderElem = screen.getByTestId(HeaderTestIds.PLACEHOLDER);
        expect(placeholderElem).not.toHaveClass(placeholderClass);

        act(() => scrollTo(300));
        expect(placeholderElem).toHaveClass(placeholderClass);

        act(() => scrollTo(0));
        expect(placeholderElem).not.toHaveClass(placeholderClass);
    });

    it('should open and close the menu', async () => {
        renderForSWR(<Header />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Toggle the main menu' })
        );

        expect(
            screen.getByRole('button', { name: 'megamenu logout' })
        ).toBeInTheDocument();

        await userEvent.click(document.body);
        await userEvent.click(screen.getByRole('button', { name: 'close' }));
        expect(
            screen.queryByRole('button', { name: 'megamenu logout' })
        ).not.toBeInTheDocument();
    });

    it('should open the menu', async () => {
        renderForSWR(<Header />);
        expect(screen.queryAllByRole('navigation')[2]).toBeUndefined();

        await userEvent.click(screen.getAllByRole('button')[2]);
        expect(screen.queryAllByRole('navigation')[0]).toBeInTheDocument();
    });

    it('should open and close <AuthModal />', async () => {
        renderForSWR(<Header />);

        await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(screen.queryByRole('dialog')).toBeInTheDocument();

        await userEvent.click(document.body);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render cart menu icon', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        renderForSWR(<Header />);
        await waitFor(() => {
            expect(
                screen.queryByRole('button', {
                    name: 'Open your shopping cart',
                })
            ).toBeInTheDocument();
        });
    });

    it('should render user menu icon', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        await act(async () => renderForSWR(<Header />));
        expect(
            screen.queryByRole('button', { name: 'Open your user menu' })
        ).toBeInTheDocument();
    });

    it('should open cart menu', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        renderForSWR(<Header />);
        await waitFor(() => {
            expect(
                screen.queryByRole('button', {
                    name: 'Open your shopping cart',
                })
            ).toBeInTheDocument();
        });

        await userEvent.click(
            screen.queryByRole('button', { name: 'Open your shopping cart' })
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('region')[1]).toHaveClass('active');
        });
    });

    it('should open user menu', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        renderForSWR(<Header />);

        await userEvent.click(
            screen.getByRole('button', { name: 'Open your user menu' })
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('region')[0]).toHaveClass('active');
        });
    });

    it('should log the user out', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        UserService.logout.mockResolvedValueOnce({ success: true });
        DataLayerService.getDigitaldata.mockResolvedValue({ users: [] });
        renderForSWR(<Header />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Open your user menu' })
        );
        await userEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(UserService.logout).toHaveBeenCalledTimes(1);
    });

    it('should not close the menu if logout fails', async () => {
        useAuthStore.setState({ isAuthenticated: true });
        UserService.logout.mockRejectedValueOnce(
            new Error('stuff happened on logout')
        );
        renderForSWR(<Header />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Open your user menu' })
        );
        await userEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(screen.queryAllByRole('region')[0]).toHaveClass('active');
    });
    it('should render the subscriptions link', async () => {
        renderForSWR(<Header />);
        expect(screen.getByRole('link', { name: 'Subscribe' })).toHaveAttribute(
            'href',
            expect.stringContaining('/subscriptions?ab=')
        );
    });
    it('should render the subscriber gift link', async () => {
        const userProfile = {
            subscriber: {
                subscriptions: [
                    {
                        subscriptionAccessLevel: 'NON',
                    },
                ],
            },
        };

        useUserStore.getState().setProfile(userProfile);
        renderForSWR(<Header />);
        expect(
            screen.getByRole('link', { name: 'Give a Gift!' })
        ).toHaveAttribute(
            'href',
            expect.stringContaining('/gift-subscriptions')
        );
    });
});
