import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import Button from 'Components/Button/Button';
import useOnOutsideClick from 'Hooks/useOnOutsideClick/useOnOutsideClick';
import styles from './HeaderMenu.module.scss';

/**
 * The `HeaderMenu` component is a menu wrapper component. `HeaderMenu` takes
 * show and on close. `HeaderMenu` has certain container animations.
 *
 * @example
 * const [showHeaderMenu, setShowHeaderMenu] = useState(false);
 * return (
 *     <>
 *         <button type="button" onClick={() => setShowHeaderMenu(true)}>
 *             Menu
 *         </button>
 *         <HeaderMenu
 *             show={showHeaderMenu}
 *             onClose={() => setShowHeaderMenu(false)}
 *             caretClasses={styles.cart}
 *             containerClasses={styles.container}
 *             label={label}
 *         >
 *             <span>Children</span>
 *         </HeaderMenu>
 *     </>
 * );
 */
function HeaderMenu({
    show,
    onClose,
    children,
    caretClasses,
    containerClasses,
    label,
}) {
    const menuRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [delayedHide, setDelayedHide] = useState(false);

    useOnOutsideClick(menuRef, onClose);

    useEffect(() => {
        let menuAnimationStartTimeout;
        let menuAnimationEndTimeout;
        let menuDelayedAnimationEndTimeout;

        if (show) {
            setDelayedHide(true);

            menuAnimationStartTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 400);
        } else {
            menuAnimationEndTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 400);
            menuDelayedAnimationEndTimeout = setTimeout(() => {
                setDelayedHide(false);
            }, 800);
        }

        return () => {
            if (menuAnimationStartTimeout !== undefined) {
                clearTimeout(menuAnimationStartTimeout);
            }
            if (menuAnimationEndTimeout !== undefined) {
                clearTimeout(menuAnimationEndTimeout);
            }
            if (menuDelayedAnimationEndTimeout !== undefined) {
                clearTimeout(menuDelayedAnimationEndTimeout);
            }
        };
    }, [show]);

    useEffect(() => {
        const hideMenu = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', hideMenu);
        return () => {
            window.removeEventListener('keydown', hideMenu);
        };
    }, [onClose]);

    const menuWithClasses = classNames({
        [styles['header-menu']]: true,
        [containerClasses]: true,
        [styles['fadeout-flyouts']]: !show && !isVisible,
        [styles['fade-in-flyout']]: show || isVisible,
        [styles.active]: show || isVisible || (!isVisible && delayedHide),
    });

    return (
        <div
            className={menuWithClasses}
            ref={menuRef}
            role="region"
            aria-label={label}
        >
            <FocusTrap active={isVisible}>
                <div>
                    <SVGIcon
                        className={`${styles.caret} ${caretClasses}`}
                        variant={SVGIcon.variants.CARET}
                    />
                    <div className={styles['close-button']}>
                        <Button
                            variant={Button.variants.TEXT}
                            className={styles['close-btn']}
                            label="Close the header menu"
                            onClick={onClose}
                        >
                            <SVGIcon
                                variant={SVGIcon.variants.X}
                                className={styles['close-icon']}
                            />
                        </Button>
                    </div>
                    {children}
                </div>
            </FocusTrap>
        </div>
    );
}

HeaderMenu.defaultProps = {
    caretClasses: '',
    containerClasses: '',
};
HeaderMenu.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    caretClasses: PropTypes.string,
    containerClasses: PropTypes.string,
    label: PropTypes.string.isRequired,
};
export default HeaderMenu;
