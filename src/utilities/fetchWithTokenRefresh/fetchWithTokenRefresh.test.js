/* global globalThis */
import noop from 'Helpers/noop/noop';
import fetcher from './fetchWithTokenRefresh';

describe('fetchWithTokenRefresh', () => {
    beforeEach(() => {
        globalThis.fetch = noop;
    });

    it('should return a response without refreshing the token', async () => {
        const mockResponse = { status: 200 };
        globalThis.fetch = jest.fn(() => {
            return mockResponse;
        });

        const actualResponse = fetcher('/some/api');

        await expect(actualResponse).resolves.toEqual(mockResponse);
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('should try to refresh the token and return the original response', async () => {
        const mockResponses = [{ status: 401 }, { status: 400 }];
        let responseCounter = 0;
        globalThis.fetch = jest.fn(() => {
            const mockResponse = mockResponses[responseCounter];
            responseCounter += 1;
            return mockResponse;
        });

        const actualResponse = fetcher('/some/api');

        await expect(actualResponse).resolves.toEqual(mockResponses[0]);
        expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    it('should refresh the token and return the updated response', async () => {
        const mockResponses = [
            { status: 401 },
            { status: 200 },
            { status: 404 },
        ];
        let responseCounter = 0;
        globalThis.fetch = jest.fn(() => {
            const mockResponse = mockResponses[responseCounter];
            responseCounter += 1;
            return mockResponse;
        });

        const actualResponse = fetcher('/some/api');

        await expect(actualResponse).resolves.toEqual(mockResponses[2]);
        expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    });
});
