import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Anchor from 'Components/Anchor/Anchor';
import Button from 'Components/Button/Button';
import useUserStore from 'Stores/user/user.store';
import styles from './UserMenu.module.scss';
import HeaderMenu from '../HeaderMenu/HeaderMenu';

/**
 * The `UserMenu` component displays menu specific to the user. `UserMenu`
 * is rendered on authentication. Show property is used to render the menu.
 *
 * @example
 * const [showUserMenu, setIsUserMenuOpen] = useState(false);
 * const handleLogout = () => {};
 * return (
 *     <>
 *          <UserMenu
 *                 show={showUserMenu}
 *                 onClose={() => setIsUserMenuOpen(false)}
 *                 handleLogout={handleLogout}
 *          />
 *          <button onClick={() => setIsUserMenuOpen(true)} type="button">
 *             Open User Menu
 *         </button>
 *     </>
 * );
 */
function UserMenu({ show, onClose, handleLogout }) {
    const profile = useUserStore((state) => state.profile);
    const subscriberType = profile?.subscriber?.subscriberTypeCaption || null;
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        let userContentAnimationStartTimeout;
        let userContentAnimationEndTimeout;

        if (show) {
            userContentAnimationStartTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 400);
        } else {
            userContentAnimationEndTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 400);
        }

        return () => {
            if (userContentAnimationStartTimeout !== undefined) {
                clearTimeout(userContentAnimationStartTimeout);
            }
            if (userContentAnimationEndTimeout !== undefined) {
                clearTimeout(userContentAnimationEndTimeout);
            }
        };
    }, [show]);

    const contentClasses = classNames({
        [styles['fade-in-flyout--links']]: isVisible && show,
        [styles['fadeout-flyout--links']]: (!show && isVisible) || !isVisible,
        [styles['opacity-0']]: (!show && !isVisible) || !isVisible,
    });

    return (
        <HeaderMenu
            show={show}
            onClose={onClose}
            containerClasses={styles['header-menu']}
            label="User Menu"
        >
            <div
                className={`${styles['menu--items']} ${styles['user-menu--name']}`}
            >
                <div
                    className={`${styles['font-bold']} ${styles['flyout-title']}`}
                >
                    {profile ? profile.displayName : ''}
                </div>

                <div className={styles['subscriber-type']}>
                    {subscriberType}
                </div>
            </div>
            <nav className={contentClasses} aria-label="User Menu links">
                <ul className={styles['list-container']}>
                    <li className={styles['list-item']}>
                        <Anchor
                            href="/my-library/library"
                            className={styles.link}
                        >
                            My Library
                        </Anchor>
                    </li>
                    <li className={styles['list-item']}>
                        <Anchor
                            href="/my-library/topics"
                            className={styles.link}
                        >
                            Topic Feeds
                        </Anchor>
                    </li>
                    <li className={styles['list-item']}>
                        <Anchor
                            href="/my-library/orders"
                            className={styles.link}
                        >
                            Orders
                        </Anchor>
                    </li>
                    <li className={styles['list-item']}>
                        <Anchor
                            href="/my-library/settings"
                            className={styles.link}
                        >
                            Account Settings
                        </Anchor>
                    </li>

                    <li className={styles['list-item']}>
                        <Anchor
                            href="/my-library/preferences"
                            className={styles.link}
                        >
                            Email Preferences
                        </Anchor>
                    </li>
                    <li className={styles['list-item']}>
                        <Button
                            onClick={handleLogout}
                            className={styles.link}
                            variant={Button.variants.TEXT}
                        >
                            Logout
                        </Button>
                    </li>
                </ul>
            </nav>
        </HeaderMenu>
    );
}

UserMenu.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default UserMenu;
