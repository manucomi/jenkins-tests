// eslint-disable-next-line import/extensions
import HTTPError from 'Errors/HTTPError/HTTPError';

/**
 * This class defines the digital data fetching.
 */
const DataLayerService = class {
    /**
     * @property {object} endpoints - An enumerated type for data layer endpoints.
     * @property {string} endpoints.DIGITAL_DATA - An enum representing the endpoint for fetching data layer attributes.
     */
    static endpoints = {
        DIGITAL_DATA: '/api/digital-data/landing/most-popular',
    };

    /**
     * Gets all of the digital data content.
     *
     * @param {object} [serverOptions={}] - Options to be used server side.
     * @returns {Promise<object>} - The initial JSON representation of data layer.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async getDigitaldata(serverOptions = {}) {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
            referrerPolicy: 'no-referrer',
        };

        options.headers.cookie = serverOptions.request?.headers?.cookie;

        const baseURL = serverOptions.baseURL ?? '';

        const response = await fetch(
            `${baseURL}${this.endpoints.DIGITAL_DATA}`,
            options
        );

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }
};

export default DataLayerService;
