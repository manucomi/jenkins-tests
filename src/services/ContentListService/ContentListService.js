import HTTPError from 'Errors/HTTPError/HTTPError';
import useConfigStore from 'Stores/configuration/configuration.store';
import UserService from '../UserService/UserService';

/**
 * This class defines static methods for manipulating content lists and the
 * items within them.
 */
const ContentListService = class {
    /**
     * Gets all of the user's content lists.
     *
     * @returns {Promise<Array>} - The array of lists returned from the endpoint.
     * @throws {HTTPError} - On a non 200 status.
     */
    static async getContentLists() {
        const profile = await UserService.getProfile();
        return profile.folders;
    }

    /**
     * Creates a new content list with the given name and description.
     *
     * @param {string} name - The name of the content list.
     * @param {string} [description=""] - The description of the content list.
     * @returns {Promise<object>} - An object returned from the endpoint, representing the list.
     * @throws {HTTPError} - On a non 200 status.
     */
    static async createContentList(name, description = '') {
        const response = await fetch(
            `${useConfigStore.getState().config.apiOrigin}/hbr/api/user/folder`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            }
        );

        if (response.status === 200) {
            return response.json();
        }

        throw new HTTPError(response.status);
    }

    /**
     * Adds an item to 0 or more lists.
     *
     * @param {number} itemID - The ID of the item being added.
     * @param {number[]} listIds - An array of list IDs.
     * @returns {Promise<object>} - An array containing the one item that was added.
     * @throws {HTTPError} - On a non 201 status.
     */
    static async addItemToLists(itemID, listIds) {
        const response = await fetch(
            `${
                useConfigStore.getState().config.apiOrigin
            }/hbr/api/user/folders/items/bulk-save`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: itemID, listIds }),
            }
        );

        if (response.status === 201) {
            return response.json();
        }
        throw new HTTPError(response.status);
    }

    /**
     * Removes an item from 0 or more lists.
     *
     * @param {number} itemID - The ID of the item to be removed.
     * @param {number[]} listIds - An array of list IDs to remove the item from.
     * @returns {Promise} - A resolved promise with no data.
     * @throws {HTTPError} - On a non 204 status.
     */
    static async removeItemFromLists(itemID, listIds) {
        const response = await fetch(
            `${
                useConfigStore.getState().config.apiOrigin
            }/hbr/api/user/folders/items/bulk-delete`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: itemID, listIds }),
            }
        );

        if (response.status === 204) {
            return Promise.resolve();
        }
        throw new HTTPError(response.status);
    }
};

export default ContentListService;
