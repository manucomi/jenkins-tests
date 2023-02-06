/**
 * A test helper for mocking window.fetch.
 *
 * @param {number} statusCode - The status code you want to return.
 * @param {any} [data={}] - The data to return in the response.json method.
 * @returns {Function} - The mocked fetch function.
 * @example
 * window.fetch = mockFetch(200, { firstName: 'Jessica', lastName: 'Smith' });
 */
const mockFetch = (statusCode, data = {}) => {
    return () => {
        return new Promise((resolveFetch) => {
            resolveFetch({
                status: statusCode,
                json: () => {
                    return new Promise((resolveJSON) => {
                        resolveJSON(data);
                    });
                },
            });
        });
    };
};

export default mockFetch;
