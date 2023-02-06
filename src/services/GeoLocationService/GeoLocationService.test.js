import useGeoLocationStore from 'Stores/geoLocation/geoLocation.store';
import GeoLocationService from './GeoLocationService';

beforeEach(() => {
    window.geoip2 = {
        country: jest.fn((successCallback) =>
            successCallback({ country: { iso_code: 'US' } })
        ),
    };
});

afterEach(() => {
    jest.clearAllMocks();
    useGeoLocationStore.getState().setCountryCode(null);
});

describe('GeoLocationService', () => {
    describe('#isUSUser()', () => {
        it('should return if user is US user', async () => {
            useGeoLocationStore.getState().setCountryCode('US');
            await expect(GeoLocationService.isUSUser()).resolves.toBe(true);

            useGeoLocationStore.getState().setCountryCode('EU');
            return expect(GeoLocationService.isUSUser()).resolves.toBe(false);
        });

        it('should get the location from api only once', () => {
            GeoLocationService.isUSUser();
            GeoLocationService.isUSUser();
            expect(window.geoip2.country).toHaveBeenCalledTimes(1);
        });

        it('should not get location from api when country code is in state', () => {
            useGeoLocationStore.getState().setCountryCode('US');
            GeoLocationService.isUSUser();
            expect(window.geoip2.country).not.toHaveBeenCalled();
        });

        it('should return false when the API fails to retrieve the location', () => {
            window.geoip2 = {
                country: jest.fn((successCallback, failCallback) =>
                    failCallback()
                ),
            };
            return expect(GeoLocationService.isUSUser()).resolves.toBe(false);
        });
    });
});
