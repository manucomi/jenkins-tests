import HTTPError from 'Errors/HTTPError/HTTPError';
import useConfigStore from 'Stores/configuration/configuration.store';

/**
 * This class defines static methods for logging interactions via HTTP.
 */
const InteractionService = class {
    /**
     * Logs save interactions to the endpoint.
     *
     * @param {object} dataPoints - An object containing data points to be logged.
     * @returns {Promise<any>} - A promise that resolves to the response data.
     * @throws {HTTPError} - On a non 201 status.
     */
    static async save(dataPoints) {
        const body = {
            ...dataPoints,
            activityType: 'saved',
            itemId: dataPoints.id,
            dek: dataPoints.summary,
        };
        const response = await fetch(
            `${useConfigStore.getState().config.apiOrigin}/hbr/api/user/items`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (response.status === 201 || response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }
};

export default InteractionService;
