import HTTPError from 'Errors/HTTPError/HTTPError';

/**
 * This class defines the cart related methods.
 *
 * @class CartService
 */
const CartService = class {
    /**
     * @property {object} endpoints - An enumerable type for cart endpoints.
     * @property {string} endpoints.CART - An enum for the endpoint to get cart details.
     */
    static endpoints = {
        CART: '/api/shopping-cart',
    };

    /**
     * Gets all of the shopping cart content.
     *
     * @returns {Promise<Array>} - The array of content returned from the endpoint.
     * @throws {HTTPError} - On a non 200 status.
     */
    static async getCart() {
        const response = await fetch(CartService.endpoints.CART, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
            referrerPolicy: 'no-referrer',
        });

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }
};

export default CartService;
