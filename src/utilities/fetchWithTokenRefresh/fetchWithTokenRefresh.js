/* global globalThis */
import useConfigStore from 'Stores/configuration/configuration.store';

const fetcher = async (
    resource,
    fetchOptions = {},
    options = { baseURL: useConfigStore.getState().config.apiOrigin }
) => {
    let response = await globalThis.fetch(
        `${options.baseURL}${resource}`,
        fetchOptions
    );

    if (response.status === 401) {
        const refreshResponse = await globalThis.fetch(
            `${options.baseURL}/hbr/api/user/refresh-token`,
            fetchOptions
        );

        if (refreshResponse.status === 200) {
            response = await globalThis.fetch(
                `${options.baseURL}${resource}`,
                fetchOptions
            );
        }
    }

    return response;
};

export default fetcher;
