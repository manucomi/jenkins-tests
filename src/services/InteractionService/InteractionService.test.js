import HTTPError from 'Errors/HTTPError/HTTPError';
import InteractionService from './InteractionService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

describe('InteractionService', () => {
    const mockDataPoints = {
        itemId: 123,
        title: 'Learn the Alphabet!',
        dek: 'Summary',
    };

    describe('#save()', () => {
        it('should resolve and return the created save item', () => {
            const mockResponse = { ...mockDataPoints, savedActivityId: 456 };
            window.fetch = mockFetch(201, mockResponse);

            return expect(
                InteractionService.save(mockDataPoints)
            ).resolves.toBe(mockResponse);
        });

        it("should reject/throw when getting the user's save lists fails", () => {
            window.fetch = mockFetch(401);

            return expect(
                InteractionService.save(mockDataPoints)
            ).rejects.toThrow(HTTPError);
        });
    });
});
