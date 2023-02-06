import HTTPError from 'Errors/HTTPError/HTTPError';

/**
 * This class provides static methods and variables for a captcha integration.
 */
const CaptchaService = class {
    /**
     * @memberof CaptchaService
     * @property {object} endpoints - An enumerable type for captcha endpoints.
     * @property {string} endpoints.ENABLED - An enum for the captcha flag endpoint.
     */
    static endpoints = {
        ENABLED: '/api/recaptcha/enabled',
    };

    /**
     * @memberof CaptchaService
     * @property {object} keys - An enumerable type for captcha API keys.
     * @property {string} keys.CHECKBOX - An enum for the captcha checkbox API key.
     */
    static keys = {
        CHECKBOX: '6LdypdcZAAAAAP5-ImlDk0BQSQ3oLpwjcILQ-1bw',
    };

    /**
     * Fetches a flag from the server to inform if captcha is enabled
     * on the site.
     *
     * @memberof CaptchaService
     * @static
     * @returns {Promise<boolean>} - The value of the flag.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async isCaptchaEnabled() {
        const response = await fetch(CaptchaService.endpoints.ENABLED, {
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

export default CaptchaService;
