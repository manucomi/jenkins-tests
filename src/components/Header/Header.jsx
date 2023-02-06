import React, { useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import useSWR from 'swr';
import Anchor from 'Components/Anchor/Anchor';
import Button from 'Components/Button/Button';
import Logo from 'Components/Logo/Logo';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import AuthModal from 'Components/AuthModal/AuthModal';
import AdSlot from 'Components/AdSlot/AdSlot';
import CartService from 'Services/CartService/CartService';
import UserService from 'Services/UserService/UserService';
import useAdConsent from 'Hooks/useAdConsent/useAdConsent';
import DataLayer from 'Domains/DataLayer/DataLayer';
import useAuthStore from 'Stores/auth/auth.store';
import useUserStore from 'Stores/user/user.store';
import MegaMenu from './MegaMenu/MegaMenu';
import NavBar from './NavBar/NavBar';
import UserMenu from './UserMenu/UserMenu';
import Cart from './Cart/Cart';
import styles from './Header.module.scss';

const TestIds = {
    PLACEHOLDER: 'placeholder',
};

function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [returnFocusToRef, setReturnFocusToRef] = useState(null);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [openCartMenu, setOpenCartMenu] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const headerRef = useRef(null);
    const mainContentRef = useRef(null);
    const menuButtonRef = useRef(null);
    const searchButtonRef = useRef(null);
    const placeholderRef = useRef(null);
    const adConsent = useAdConsent();
    const adSizes = useMemo(
        () => [
            [970, 90],
            [728, 90],
            [1940, 180],
            [300, 50],
            [320, 50],
            [600, 100],
        ],
        []
    );

    const { data: cartData } = useSWR(
        isAuthenticated ? 'cart:authenticated' : 'cart:annonymous',
        CartService.getCart
    );

    let cartItems = [];

    if (cartData?.cart?.line_items) {
        cartItems = [
            ...cartData.cart.line_items.physical_items,
            ...cartData.cart.line_items.digital_items,
        ];
    }
    const adTargets = useMemo(() => ({ position: '1', inventory: 'ATF' }), []);

    useEffect(() => {
        placeholderRef.current.style.height = `${mainContentRef.current.offsetHeight}px`;
    }, []);

    useEffect(() => {
        const stickyPosition =
            mainContentRef.current.offsetHeight > 80
                ? headerRef.current.offsetTop + 40
                : headerRef.current.offsetTop;
        const handleScroll = () => {
            setIsSticky(window.pageYOffset > stickyPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSignInClick = () => setIsSignInOpen(true);
    const handleSignInClose = () => setIsSignInOpen(false);

    const handleMenuButtonClick = (ref) => {
        setIsMenuOpen(true);
        setReturnFocusToRef(ref);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        returnFocusToRef?.current.focus();
    };

    const handleLogout = async () => {
        try {
            await UserService.logout();
            const dataLayer = new DataLayer();
            await dataLayer.init();
            dataLayer.updateUsers();
            if (isMenuOpen) handleMenuClose();
            if (openUserMenu) setOpenUserMenu(false);
        } catch (error) {
            console.log(error);
        }

        return Promise.resolve();
    };
    const headerWithClasses = classNames({
        [styles.header]: true,
        [styles.sticky]: isSticky,
    });
    const placeholderWithClasses = classNames({
        [styles.placeholder]: true,
        [styles['placeholder-visible']]: isSticky,
    });
    const navbarWithClasses = classNames({
        [styles.navbar]: true,
        [styles['navbar-hide']]: isSticky,
    });
    const adSlotContainerClasses = classNames({
        [styles['ad-container']]: true,
        [styles['collapse-slot']]: adConsent === false,
    });

    const targets = useMemo(
        () => ({
            ab: 'topbar-subtout',
            tpcc: 'houseads.site.topbar-subtout',
        }),
        []
    );

    const isSubscribed = !!useUserStore((state) => state.profile)?.subscriber;
    const queryParams = useMemo(
        () =>
            Object.entries(targets).reduce(
                (accumulator, entry) =>
                    `${accumulator}&${entry[0]}=${entry[1]}`,
                ''
            ),
        [targets]
    );

    const subscribeURL = useMemo(() => {
        let url;

        if (isSubscribed) {
            url = `/gift-subscriptions?${queryParams.slice(1)}`;
        } else {
            url = `/subscriptions${
                queryParams.length ? `?${queryParams.slice(1)}` : ''
            }`;
        }

        return url;
    }, [isSubscribed, queryParams]);

    return (
        <>
            <div className={adSlotContainerClasses}>
                {adConsent && (
                    <AdSlot
                        path="/34363400/HBR_970x90"
                        size={adSizes}
                        targets={adTargets}
                        id="DFP_pos1"
                    />
                )}
            </div>
            <div
                className={placeholderWithClasses}
                data-testid={TestIds.PLACEHOLDER}
                ref={placeholderRef}
            />
            <header className={headerWithClasses} ref={headerRef}>
                <div className={styles['main-content']} ref={mainContentRef}>
                    <Button
                        variant={Button.variants.TEXT}
                        className={styles.hamburger}
                        onClick={() => handleMenuButtonClick(menuButtonRef)}
                        ref={menuButtonRef}
                        label="Toggle the main menu"
                    >
                        <SVGIcon
                            variant={SVGIcon.variants.HAMBURGER}
                            className={styles['hamburger-icon']}
                        />
                    </Button>
                    <div className={styles['logo-container']}>
                        <Anchor href="/">
                            <Logo
                                className={styles.logo}
                                variant={Logo.variants.HBR_NO_SHIELD}
                            />
                        </Anchor>
                    </div>
                    <div className={styles['subscribe-sign-in']}>
                        {isSubscribed ? (
                            <Anchor
                                className={styles['subscribe-link-red']}
                                href={subscribeURL}
                                newTab
                            >
                                Give a Gift!
                            </Anchor>
                        ) : (
                            <Anchor
                                className={styles['subscribe-button']}
                                href={subscribeURL}
                                newTab
                            >
                                Subscribe
                            </Anchor>
                        )}
                        {!!cartItems.length && (
                            <Button
                                className={styles.cart}
                                variant={Button.variants.TEXT}
                                ariaExpanded={openCartMenu}
                                onClick={() => setOpenCartMenu(!openCartMenu)}
                                label="Open your shopping cart"
                            >
                                <img
                                    className={styles['cart-image-size']}
                                    src="https://hbr.org/most-popular/images/cart-icon.png"
                                    alt="Cart"
                                />
                                <span className={styles['cart-count']}>
                                    {cartItems.length}
                                </span>
                            </Button>
                        )}
                        {!isAuthenticated && (
                            <Button
                                variant={Button.variants.TEXT}
                                className={styles['sign-in']}
                                onClick={handleSignInClick}
                                id="sign-in-button-header"
                            >
                                Sign In
                            </Button>
                        )}
                        {isAuthenticated ? (
                            <Button
                                variant={Button.variants.TEXT}
                                className={styles['user-menu-button']}
                                ariaExpanded={openUserMenu}
                                onClick={() => setOpenUserMenu(!openUserMenu)}
                                label="Open your user menu"
                            >
                                <SVGIcon
                                    variant={SVGIcon.variants.USER_IN_SHIELD}
                                />
                            </Button>
                        ) : null}
                    </div>

                    <Button
                        variant={Button.variants.TEXT}
                        className={styles.search}
                        onClick={() => handleMenuButtonClick(searchButtonRef)}
                        ref={searchButtonRef}
                        label="Search hbr.org"
                    >
                        <SVGIcon variant={SVGIcon.variants.SEARCH} />
                    </Button>
                </div>
                <NavBar className={navbarWithClasses} />
                {isAuthenticated && (
                    <UserMenu
                        show={openUserMenu}
                        onClose={() => setOpenUserMenu(false)}
                        handleLogout={handleLogout}
                    />
                )}
                <MegaMenu
                    show={isMenuOpen}
                    onClose={handleMenuClose}
                    handleSignInClick={handleSignInClick}
                    handleLogout={handleLogout}
                />

                {!!cartItems.length && (
                    <Cart
                        show={openCartMenu}
                        onClose={() => setOpenCartMenu(false)}
                        items={cartItems}
                        totalCartAmount={cartData?.cart?.cart_amount}
                    />
                )}
            </header>
            {isSignInOpen && <AuthModal onClose={handleSignInClose} />}
        </>
    );
}

export default Header;
export { TestIds as HeaderTestIds };
