import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Anchor from 'Components/Anchor/Anchor';
import Heading from 'Components/Heading/Heading';
import styles from './Cart.module.scss';
import HeaderMenu from '../HeaderMenu/HeaderMenu';

const TestIds = {
    MENU_CONTENT: 'menu-content',
};

const priceWithComma = (price) => {
    return `$${price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * The `Cart` component displays the details of the user's shopping cart. The user should be authenticated to see the `Cart`.
 *
 * @example
 * const [showCart, setShowCart] = useState(false);
 * const cartItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
 * const cartTotal = 33.95;
 * return (
 *     <>
 *         <button type="button" onClick={() => setShowCart(true)}>
 *             Cart
 *         </button>
 *         <Cart
 *             show={showCart}
 *             onClose={() => setShowCart(false)}
 *             items={cartItems}
 *             totalCartAmount={cartTotal}
 *         />
 *     </>
 * );
 */
function Cart({ show, onClose, items, totalCartAmount }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let cartContentAnimationStartTimeout;
        let cartContentAnimationEndTimeout;

        if (show) {
            cartContentAnimationStartTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 400);
        } else {
            cartContentAnimationEndTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 400);
        }

        return () => {
            if (cartContentAnimationStartTimeout !== undefined) {
                clearTimeout(cartContentAnimationStartTimeout);
            }
            if (cartContentAnimationEndTimeout !== undefined) {
                clearTimeout(cartContentAnimationEndTimeout);
            }
        };
    }, [show]);
    const contentWithClasses = classNames({
        [styles['fade-in-flyout--links']]: isVisible && show,
        [styles['fadeout-flyout--links']]: (!show && isVisible) || !isVisible,
        [styles['opacity-0']]: (!show && !isVisible) || !isVisible,
    });

    return (
        <HeaderMenu
            show={show}
            onClose={onClose}
            caretClasses={styles.caret}
            containerClasses={styles['header-menu']}
            label="Cart Menu"
        >
            <div
                className={`${styles['menu-items']} ${styles['cart-menu-name']}`}
            >
                <Heading className={`${styles['flyout-title']}`} level={4}>
                    Your Cart
                </Heading>
            </div>
            <div
                className={contentWithClasses}
                data-testid={TestIds.MENU_CONTENT}
            >
                <div className={styles['cart-items-container']}>
                    <div>
                        <ul className={styles['items-container']}>
                            {items.map((item) => (
                                <li
                                    className={`${styles['content-list-row']}`}
                                    key={`item-${item.name}`}
                                >
                                    <div>
                                        <Anchor
                                            href={item.url}
                                            className={styles['link-black']}
                                            id={item.name}
                                        >
                                            {item.name}
                                        </Anchor>
                                        <p
                                            className={
                                                styles['cart-item-amount']
                                            }
                                            id={item.quantity}
                                        >
                                            {item.quantity}
                                        </p>
                                    </div>
                                    <div className={styles['cart-item-price']}>
                                        {`${priceWithComma(
                                            parseFloat(
                                                item.sale_price * item.quantity
                                            ).toFixed(2)
                                        )}`}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles['cart-total-container']}>
                    <div className={styles['cart-total']}>Total</div>
                    <div className={styles['cart-total-amount']}>
                        {`${priceWithComma(
                            parseFloat(totalCartAmount).toFixed(2)
                        )}`}
                    </div>
                </div>
                <Anchor
                    href="/shopping-cart"
                    className={styles['button-tight']}
                >
                    View Cart
                </Anchor>
            </div>
        </HeaderMenu>
    );
}

Cart.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            list_price: PropTypes.number,
            name: PropTypes.string,
        })
    ).isRequired,
    totalCartAmount: PropTypes.number.isRequired,
};

export default Cart;
export { TestIds as CartTestIds };
