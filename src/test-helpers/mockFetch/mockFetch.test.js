import mockFetch from './mockFetch';

describe('mockFetch test helper', () => {
    it('should resolve to a mock response with the specified status code', () => {
        const statusCode = 302;
        const fetch = mockFetch(statusCode);
        return expect(fetch()).resolves.toStrictEqual({
            status: statusCode,
            json: expect.any(Function),
        });
    });

    it('should resolve the response to the specified data', async () => {
        const statusCode = 200;
        const data = { foo: 'bar' };
        const fetch = mockFetch(statusCode, data);
        const response = await fetch();
        return expect(response.json()).resolves.toBe(data);
    });
});
