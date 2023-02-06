import '@testing-library/jest-dom/extend-expect';
import HTTPError from './HTTPError';

describe('HTTPError component', () => {
    it('should throw an error', () => {
        const mockErrorTrigger = () => {
            Error.captureStackTrace = null;
            throw new HTTPError();
        };

        expect(() => {
            mockErrorTrigger();
        }).toThrow(HTTPError);
    });
});
