/**
 * This is a custom error for throwing HTTP statuses. The constructor takes an
 * HTTP status code, data, and other arguments. This extends Error.
 *
 * @augments Error
 */
const HTTPError = class extends Error {
    /**
     * Custom error constructor.
     *
     * @param {number} statusCode - The HTTP status code being thrown.
     * @param {object} data - Data associated with the error.
     * @param {Array} args - The remaining arguments that are passed to the Error constructor.
     */
    constructor(statusCode, data, ...args) {
        super(...args);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError);
        }

        this.name = 'HTTPError';
        this.statusCode = statusCode;
        this.data = data;
    }
};

export default HTTPError;
