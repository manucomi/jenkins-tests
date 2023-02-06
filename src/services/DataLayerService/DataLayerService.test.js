import HTTPError from 'Errors/HTTPError/HTTPError';
import DataLayerService from './DataLayerService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

const serverOptions = {
    request: {
        headers: {
            cookie: { abc: '1' },
        },
    },
    baseURL: 'http:hbr.org',
};

describe('DatalayerService', () => {
    describe('#getDigitalData()', () => {
        it('should get the digital Data', () => {
            const mockResponse = {
                users: [{ profile: { daysSinceLastVisit: 0 } }],
            };
            window.fetch = mockFetch(200, mockResponse);

            return expect(
                DataLayerService.getDigitaldata(serverOptions)
            ).resolves.toBe(mockResponse);
        });

        it('should reject/throw when getting the digital data fails', () => {
            window.fetch = mockFetch(401);

            return expect(DataLayerService.getDigitaldata()).rejects.toThrow(
                HTTPError
            );
        });
    });
});
