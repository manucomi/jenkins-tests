import HTTPError from 'Errors/HTTPError/HTTPError';
import ContentListService from './ContentListService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

describe('ContentListsService', () => {
    describe('#getContentLists()', () => {
        it("should get the user's save lists", () => {
            const mockResponse = { folders: [{ id: 123 }, { id: 456 }] };
            window.fetch = mockFetch(200, mockResponse);

            return expect(ContentListService.getContentLists()).resolves.toBe(
                mockResponse.folders
            );
        });

        it("should reject/throw when getting the user's save lists fails", () => {
            window.fetch = mockFetch(401);

            return expect(ContentListService.getContentLists()).rejects.toThrow(
                HTTPError
            );
        });
    });

    describe('#createContentList()', () => {
        const mockFormData = ['Read Soon', 'Content I want to read soon.'];

        it('should resolve and return the created list', () => {
            const mockList = {
                id: 11,
                title: mockFormData[0],
                description: mockFormData[1],
            };
            window.fetch = mockFetch(200, mockList);

            return expect(
                ContentListService.createContentList(...mockFormData)
            ).resolves.toBe(mockList);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(401);

            return expect(
                ContentListService.createContentList()
            ).rejects.toThrow(HTTPError);
        });
    });

    describe('#addItemToLists()', () => {
        const mockItem = { id: 123 };

        it('should resolve and return the item that was added', () => {
            window.fetch = mockFetch(201, mockItem);

            return expect(
                ContentListService.addItemToLists(mockItem.id, [23, 24])
            ).resolves.toBe(mockItem);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(401);

            return expect(
                ContentListService.addItemToLists(mockItem.id, [23, 24])
            ).rejects.toThrow(HTTPError);
        });
    });

    describe('#removeItemFromLists()', () => {
        const mockItem = { id: 123 };

        it('should resolve', () => {
            window.fetch = mockFetch(204);

            return expect(
                ContentListService.removeItemFromLists(mockItem.id, [23, 24])
            ).resolves.toBeUndefined();
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(401);

            return expect(
                ContentListService.removeItemFromLists(mockItem.id, [23, 24])
            ).rejects.toThrow(HTTPError);
        });
    });
});
