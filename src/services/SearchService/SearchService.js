import HTTPError from 'Errors/HTTPError/HTTPError';

/**
 * SearchService defines some static methods related to fetching
 * paginated content.
 */
const SearchService = class {
    /**
     * Fetches the most popular content.
     *
     * @param {number} pageNumber - The page number to fetch results for.
     * @param {number} [pageSize=8] - The number of content items in the page.
     * @param {object} [serverOptions={}] - Options for use on the server only.
     * @param {string} [serverOptions.baseURL=undefined] - The portion of the request URL that precedes the URI.
     * @returns {Promise<object>} - The paginated content returned from endpoint.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async getMostPopular(pageNumber, pageSize = 8, serverOptions = {}) {
        const baseURL = serverOptions.baseURL ?? '';

        const response = await fetch(
            `${baseURL}/service/components/search-list/popular-content/${pageNumber}/${pageSize}?format=json&id=page.search-list.most-popular`
        );

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }

    /**
     * Fetches search suggestions.
     *
     * @param {string} searchTerm - The string to get suggestions for.
     * @returns {Promise<object>} - An object containing an array of results.
     * @throws {HTTPError} - When the API responds with a non 200 status.
     */
    static async getSuggestions(searchTerm) {
        const response = await fetch(
            `/service/search/auto-suggest?term=${searchTerm}`
        );

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }
};

export default SearchService;
