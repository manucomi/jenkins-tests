import useGeoLocationStore from './geoLocation.store';

describe('Geolocation store', () => {
    it('should set the country code correctly', () => {
        useGeoLocationStore.getState().setCountryCode('US');
        expect(useGeoLocationStore.getState().countryCode).toBe('US');
    });
});
