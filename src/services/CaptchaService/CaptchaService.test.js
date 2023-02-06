import HTTPError from 'Errors/HTTPError/HTTPError';
import CaptchaService from './CaptchaService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

describe('CaptchaService', () => {
    describe('#isCaptchaEnabled()', () => {
        it('should resolve and return the flag value', () => {
            const mockResponse = true;
            window.fetch = mockFetch(200, mockResponse);

            return expect(CaptchaService.isCaptchaEnabled()).resolves.toBe(
                mockResponse
            );
        });

        it('should reject/throw when fetching the flag fails', () => {
            window.fetch = mockFetch(500);

            return expect(CaptchaService.isCaptchaEnabled()).rejects.toThrow(
                HTTPError
            );
        });
    });
});
