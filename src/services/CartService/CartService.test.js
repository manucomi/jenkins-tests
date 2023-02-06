import HTTPError from 'Errors/HTTPError/HTTPError';
import CartService from './CartService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

describe('CartService', () => {
    describe('#getCart()', () => {
        it('should get the cart Data', () => {
            const mockResponse = [{ id: 123 }, { id: 456 }];
            window.fetch = mockFetch(200, mockResponse);

            return expect(CartService.getCart()).resolves.toBe(mockResponse);
        });

        it('should reject/throw when getting the cart fails', () => {
            window.fetch = mockFetch(401);

            return expect(CartService.getCart()).rejects.toThrow(HTTPError);
        });
    });
});
