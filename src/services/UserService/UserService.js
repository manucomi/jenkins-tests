import HTTPError from 'Errors/HTTPError/HTTPError';
import useConfigStore from 'Stores/configuration/configuration.store';
import useUserStore from 'Stores/user/user.store';
import useAuthStore from 'Stores/auth/auth.store';
/**
 * This class defines a number of static user related methods.
 */
const UserService = class {
    /**
     * Authenticates a user against the authenticate endpoint and sets the app
     * state if successful.
     *
     * @param {string} emailAddress - The user's email address.
     * @param {string} password - The user's password.
     * @param {?string} [captchaToken=null] - The reCAPTCHA token supplied by the reCAPTCHA API.
     * @returns {Promise<object>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async authenticate(emailAddress, password, reCaptchaToken = null) {
        const response = await fetch(
            `${useConfigStore.getState().config.apiOrigin}/hbr/api/user/login`,
            {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    emailAddress,
                    password,
                    reCaptchaToken,
                }),
            }
        );
        if (response.status === 200) {
            useAuthStore.getState().setIsAuthenticated(true);
            return response.json();
        }
        const { errors } = await response.json();
        throw new HTTPError(response.status, errors ? errors.pop() : []);
    }

    /**
     * Log a user out of the app and set the app state if successful.
     *
     * @returns {Promise<object>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async logout() {
        const response = await fetch('/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
            referrerPolicy: 'no-referrer',
        });

        if (response.status === 200) {
            useAuthStore.getState().setIsAuthenticated(false);
            useUserStore.getState().deleteProfile();
            return response.json();
        }

        throw new HTTPError(response.status);
    }

    /**
     * Creates a new user via the registration endpoint and sets the app state
     * if successful.
     *
     * @param {string} firstName - The user's first name.
     * @param {string} lastName - The user's last name.
     * @param {string} emailAddress - The user's email address.
     * @param {string} password - The desired password.
     * @param {boolean} [optIn=true] - The opt-in status.
     * @param {?string} [reCaptchaToken=null] - The captcha token used for verification.
     * @returns {Promise<object>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 201 status.
     */
    static async create(
        firstName,
        lastName,
        emailAddress,
        password,
        optIn = true,
        reCaptchaToken = null
    ) {
        const response = await fetch(
            `${
                useConfigStore.getState().config.apiOrigin
            }/hbr/api/user/register`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    emailAddress,
                    firstName,
                    lastName,
                    password,
                    optIn,
                    reCaptchaToken,
                }),
            }
        );

        if (response.status === 200) {
            useAuthStore.getState().setIsAuthenticated(true);
            const profile = await response.json();
            useUserStore.getState().setProfile(profile);
            return profile;
        }

        if (response.status === 400) {
            const { errors } = await response.json();
            throw new HTTPError(response.status, errors ? errors.pop() : []);
        }

        throw new HTTPError(response.status);
    }

    /**
     * Fetches the user's profile from the endpoint and sets the app state if
     * successful.
     *
     * @param {object} [serverOptions={}] - Options specific to server side consumption.
     * @param {string} [serverOptions.baseURL=undefined] - The portion of the request URL that precedes the URI.
     * @param {string} [serverOptions.cookies=undefined] - The cookies to be sent in the request headers.
     * @returns {Promise<any>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async getProfile(serverOptions = {}) {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
            referrerPolicy: 'no-referrer',
        };

        const baseURL =
            serverOptions.baseURL ?? useConfigStore.getState().config.apiOrigin;

        if (serverOptions.cookies) {
            options.headers.cookie = serverOptions.cookies;
        }

        const response = await fetch(
            `${baseURL}/hbr/api/user/profile`,
            options
        );

        if (response.status === 200) {
            const profile = await response.json();
            useUserStore.getState().setProfile(profile);
            return profile;
        }

        throw new HTTPError(response.status);
    }

    /**
     * Fetches a user's subscription from the endpoint.
     *
     * @param {string} emailAddress - The user's email address.
     * @returns {Promise<any>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async getSubscription(emailAddress) {
        const response = await fetch('/api/user/subscriber/search', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `emailAddress=${encodeURIComponent(emailAddress)}`,
        });

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }

    /**
     * Triggers the "forgot password" flow using an endpoint.
     *
     * @param {string} emailAddress - The user's email address.
     * @param {?string} [captchaToken=null] - The reCAPTCHA token supplied by the reCAPTCHA API.
     * @returns {Promise<{statusCode: number}>} - An object containing the HTTP status code.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async resetPassword(emailAddress, reCaptchaToken = null) {
        const response = await fetch(
            `${
                useConfigStore.getState().config.apiOrigin
            }/hbr/api/user/forgot-password`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    emailAddress,
                    reCaptchaToken,
                }),
            }
        );

        if (response.status === 200) {
            return Promise.resolve({ statusCode: response.status });
        }

        throw new HTTPError(response.status);
    }

    /**
     * Subscribes a user to a newsletter using an endpoint.
     *
     * @param {string} newsletterName - The name of the newsletter.
     * @param {string} methodType - Whether to POST or DELETE a newsletter subscription request.
     * @returns {Promise<object>} - The data returned from the endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async subscribeNewsletter(newsletterName) {
        const response = await fetch(
            `${
                useConfigStore.getState().config.apiOrigin
            }/hbr/api/user/newsletter/subscribe`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    newsletterName,
                }),
            }
        );

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }
};

export default UserService;
