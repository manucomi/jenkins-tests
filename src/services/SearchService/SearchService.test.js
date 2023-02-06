import noop from 'Helpers/noop/noop';
import HTTPError from 'Errors/HTTPError/HTTPError';
import SearchService from './SearchService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

afterEach(() => {
    window.fetch = noop;
});

describe('SearchService', () => {
    describe('#getMostPopular()', () => {
        it('should resolve and return content results', () => {
            const mockContent = [
                { id: 11 },
                { id: 22 },
                { id: 33 },
                { id: 44 },
            ];
            window.fetch = mockFetch(200, { entry: mockContent });

            return expect(SearchService.getMostPopular(0)).resolves.toEqual({
                entry: mockContent,
            });
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(500);

            return expect(SearchService.getMostPopular(0)).rejects.toThrow(
                HTTPError
            );
        });

        it('should set fetch parameters', () => {
            const mockBaseURL = 'https://hbr.org';
            const mockPageNumber = 0;
            const mockPageSize = 16;
            window.fetch = jest.fn().mockImplementation(mockFetch(200));
            SearchService.getMostPopular(mockPageNumber, mockPageSize, {
                baseURL: mockBaseURL,
            });
            expect(window.fetch).toHaveBeenCalledWith(
                `${mockBaseURL}/service/components/search-list/popular-content/${mockPageNumber}/${mockPageSize}?format=json&id=page.search-list.most-popular`
            );
        });
    });

    describe('#getSuggestions()', () => {
        it('should return suggestions', () => {
            const mockResults = {
                records: [{ id: 1 }, { id: 843 }, { id: 23508 }],
            };
            window.fetch = mockFetch(200, mockResults);

            return expect(
                SearchService.getSuggestions('stuff')
            ).resolves.toStrictEqual(mockResults);
        });

        it('should throw an error when fetching results fails', () => {
            window.fetch = mockFetch(400);
            return expect(
                SearchService.getSuggestions('stuff')
            ).rejects.toThrow(HTTPError);
        });
    });
});
