import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import Button from 'Components/Button/Button';
import FontIcon from 'Components/FontIcon/FontIcon';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import Anchor from 'Components/Anchor/Anchor';
import useOnOutsideClick from 'Hooks/useOnOutsideClick/useOnOutsideClick';
import useUserStore from 'Stores/user/user.store';
import useAuthStore from 'Stores/auth/auth.store';
import styles from './MegaMenu.module.scss';
import useMegaMenuStore from './MegaMenu.store';
import SearchForm from './SearchForm/SearchForm';
import links from './links';

const TestIds = {
    LONG_LISTS_CONTAINER: 'long-lists-container',
};

/**
 * The `MegaMenu` component contains the main navigation menu for hbr.org and is
 * exclusively used in the `Header`.
 *
 * @example
 * const [isMenuVisible, setIsMenuVisible] = useState(false);
 * const handleClose = () => setIsMenuVisible(false);
 * const handleOpen = () => setIsMenuVisible(true);
 * const handleSignInClick = () => {};
 * const handleLogout = () => {};
 *
 * return (
 *     <>
 *         <button onClick={handleOpen} type="button">Open the menu</button>
 *              <MegaMenu
 *                  show={isMenuVisible}
 *                  onClose={handleClose}
 *                  handleSignInClick={handleSignInClick}
 *                  handleLogout={handleLogout}
 *              />
 *     </>
 * );
 */

function MegaMenu({ onClose, show, handleSignInClick, handleLogout }) {
    const [isVisible, setIsVisible] = useState(false);
    const [trapFocus, setTrapFocus] = useState(false);
    const isAutoSuggestOpen = useMegaMenuStore(
        (state) => state.isAutoSuggestOpen
    );

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const profile = useUserStore((state) => state.profile);
    const isHmmEligible = profile?.subscriber?.isHmmEligible;

    const closeBtnRef = useRef(null);
    const menuRef = useRef(null);
    const searchFieldRef = useRef(null);

    const handleMenuClose = () => {
        onClose();
        setTrapFocus(false);
    };
    useOnOutsideClick(menuRef, handleMenuClose);

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                if (searchFieldRef.current) {
                    searchFieldRef.current.focus();
                }
            }, 1);
            setTrapFocus(true);
        }
    }, [show]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleMenuClose();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    });

    useEffect(() => {
        let timeoutID;

        if (show) {
            setIsVisible(true);
        } else {
            timeoutID = setTimeout(() => {
                setIsVisible(false);
            }, 1000);
        }

        return () => {
            if (timeoutID !== undefined) {
                clearTimeout(timeoutID);
            }
        };
    }, [show]);

    const overlayClasses = classNames({
        [styles.overlay]: true,
        [styles.show]: show,
        [styles.visible]: isVisible,
    });
    const menuClasses = classNames({
        [styles['mega-menu']]: true,
        [styles['menu-open']]: show,
        [styles['menu-close']]: !show,
        [styles.visible]: isVisible,
    });
    const listContainerClasses = classNames({
        [styles['long-lists-container']]: true,
        [styles['auto-suggest-open']]: isAutoSuggestOpen,
    });

    const subscriptionLinkTargets = useMemo(
        () => ({
            ab: 'leftnav-subtout',
            tpcc: 'houseads.site.leftnav-subtout',
        }),
        []
    );

    const isSubscribed = !!useUserStore((state) => state.profile)?.subscriber;
    const queryParams = useMemo(
        () =>
            Object.entries(subscriptionLinkTargets).reduce(
                (accumulator, entry) =>
                    `${accumulator}&${entry[0]}=${entry[1]}`,
                ''
            ),
        [subscriptionLinkTargets]
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
            <div className={overlayClasses} />
            <FocusTrap active={trapFocus}>
                <nav
                    className={menuClasses}
                    ref={menuRef}
                    aria-label="Main Menu"
                >
                    <Button
                        variant={Button.variants.TEXT}
                        className={styles['btn-close']}
                        onClick={handleMenuClose}
                        ref={closeBtnRef}
                        label="Close the main menu"
                    >
                        <SVGIcon variant={SVGIcon.variants.X} />
                    </Button>
                    <div className={styles['content-container']}>
                        <SearchForm
                            className={styles.search}
                            ref={searchFieldRef}
                        />

                        <ul className={styles['short-links-list']}>
                            <div className={styles['subscribe-container']}>
                                {isSubscribed ? (
                                    <Anchor
                                        className={styles['link-red']}
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
                            </div>

                            {links.shortList.map(
                                ({ href, text, className, newTab }) => {
                                    return (
                                        ((text === 'HBR Learning' &&
                                            isHmmEligible) ||
                                            text !== 'HBR Learning') && (
                                            <li key={text}>
                                                <Anchor
                                                    href={href}
                                                    className={`${
                                                        styles.link
                                                    } ${
                                                        styles[
                                                            className ||
                                                                'link-default'
                                                        ]
                                                    } `}
                                                    newTab={newTab}
                                                >
                                                    {text}
                                                </Anchor>
                                            </li>
                                        )
                                    );
                                }
                            )}
                            <li>
                                {isAuthenticated ? (
                                    <Button
                                        className={styles.link}
                                        variant={Button.variants.TEXT}
                                        onClick={handleLogout}
                                        data-qa="mega-menu-log-out-button"
                                    >
                                        Log Out
                                    </Button>
                                ) : (
                                    <Button
                                        className={styles.link}
                                        variant={Button.variants.TEXT}
                                        onClick={handleSignInClick}
                                        data-qa="mega-menu-sign-in-button"
                                    >
                                        Sign In
                                    </Button>
                                )}
                            </li>
                        </ul>
                        <div
                            className={listContainerClasses}
                            data-testid={TestIds.LONG_LISTS_CONTAINER}
                        >
                            {links.longList.map(
                                ({ category, links: categoryLinks }, index) => (
                                    <div
                                        key={category}
                                        className={`${
                                            styles['long-list-container']
                                        } ${
                                            styles[
                                                `long-list-container-${
                                                    index + 1
                                                }`
                                            ]
                                        }`}
                                    >
                                        <p
                                            role="doc-subtitle"
                                            className={styles['list-title']}
                                        >
                                            {category}
                                        </p>
                                        <ul className={styles.list}>
                                            {categoryLinks.map(
                                                ({
                                                    href,
                                                    text,
                                                    className,
                                                    newTab,
                                                }) => {
                                                    return (
                                                        ((text ===
                                                            'HBR Learning' &&
                                                            isHmmEligible) ||
                                                            text !==
                                                                'HBR Learning') && (
                                                            <li
                                                                key={text}
                                                                className={
                                                                    styles[
                                                                        'long-links-list-item'
                                                                    ]
                                                                }
                                                            >
                                                                <Anchor
                                                                    href={href}
                                                                    className={`${
                                                                        styles.link
                                                                    } ${
                                                                        styles[
                                                                            className ||
                                                                                'link-default'
                                                                        ]
                                                                    } `}
                                                                    newTab={
                                                                        newTab
                                                                    }
                                                                >
                                                                    {text}
                                                                </Anchor>
                                                            </li>
                                                        )
                                                    );
                                                }
                                            )}
                                            {category === 'My Account' && (
                                                <li
                                                    key="login"
                                                    className={
                                                        styles[
                                                            'long-links-list-item'
                                                        ]
                                                    }
                                                >
                                                    {isAuthenticated ? (
                                                        <Button
                                                            className={
                                                                styles.link
                                                            }
                                                            variant={
                                                                Button.variants
                                                                    .TEXT
                                                            }
                                                            onClick={
                                                                handleLogout
                                                            }
                                                            data-qa="mega-menu-log-out-button"
                                                        >
                                                            Log Out
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className={
                                                                styles.link
                                                            }
                                                            variant={
                                                                Button.variants
                                                                    .TEXT
                                                            }
                                                            onClick={
                                                                handleSignInClick
                                                            }
                                                            data-qa="mega-menu-sign-in-button"
                                                        >
                                                            Sign In
                                                        </Button>
                                                    )}
                                                </li>
                                            )}
                                            {category === 'For Subscribers' && (
                                                <li
                                                    key="subscribe"
                                                    className={
                                                        styles[
                                                            'long-links-list-item'
                                                        ]
                                                    }
                                                >
                                                    <Anchor
                                                        className={`${styles.link} ${styles['link-red']}`}
                                                        href={subscribeURL}
                                                        newTab
                                                    >
                                                        {isSubscribed
                                                            ? 'Give a Gift!'
                                                            : 'Subscribe'}
                                                    </Anchor>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )
                            )}
                            <ul className={styles['social-media-list']}>
                                <li
                                    className={styles['social-media-list-item']}
                                >
                                    <Anchor
                                        href="//twitter.com/HarvardBiz"
                                        className={`${styles.link} ${styles['link-default']}`}
                                        label="HBR on Twitter"
                                        newTab
                                    >
                                        <FontIcon
                                            variant={FontIcon.variants.TWITTER}
                                        />
                                    </Anchor>
                                </li>
                                <li
                                    className={styles['social-media-list-item']}
                                >
                                    <Anchor
                                        href="//www.facebook.com/HBR"
                                        className={`${styles.link} ${styles['link-default']}`}
                                        label="HBR on Facebook"
                                        newTab
                                    >
                                        <FontIcon
                                            variant={FontIcon.variants.FACEBOOK}
                                        />
                                    </Anchor>
                                </li>
                                <li
                                    className={styles['social-media-list-item']}
                                >
                                    <Anchor
                                        href="//www.linkedin.com/company/harvard-business-review?trk=biz-companies-cym"
                                        className={`${styles.link} ${styles['link-default']}`}
                                        label="HBR on LinkedIn"
                                        newTab
                                    >
                                        <FontIcon
                                            variant={FontIcon.variants.LINKEDIN}
                                        />
                                    </Anchor>
                                </li>
                                <li
                                    className={styles['social-media-list-item']}
                                >
                                    <Anchor
                                        href="//www.instagram.com/harvard_business_review/?hl=en"
                                        className={`${styles.link} ${styles['link-default']}`}
                                        label="HBR on Instagram"
                                        newTab
                                    >
                                        <FontIcon
                                            variant={
                                                FontIcon.variants.INSTAGRAM
                                            }
                                        />
                                    </Anchor>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </FocusTrap>
        </>
    );
}

MegaMenu.defaultProps = {
    show: false,
};

MegaMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    handleSignInClick: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default MegaMenu;
export { TestIds as MegaMenuTestIds };
