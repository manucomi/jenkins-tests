import useGeoLocationStore from 'Stores/geoLocation/geoLocation.store';

/* global geoip2 */

/**
 * This class defines a number of static methods for determining a
 * user's geographical location.
 */
const GeoLocationService = class {
    /**
     * Determines if a user is located in the US.
     *
     * @returns {boolean} - Boolean to tell if US user or not.
     */
    static async isUSUser() {
        let geoIpCountryCode = '';

        try {
            geoIpCountryCode = await GeoLocationService.#getGeoLocation();
        } catch (error) {
            console.log(error);
        }

        return geoIpCountryCode === 'US';
    }

    /**
     * Determines geo location of user based on geoip service.
     *
     * @private
     * @returns {Promise<string>} - The user's country code.
     * @throws {Error} - When the geoip service encounters an error.
     */
    static #getGeoLocation() {
        const geoIpCountryCode = useGeoLocationStore.getState().countryCode;

        if (geoIpCountryCode) {
            return geoIpCountryCode;
        }

        return new Promise((resolve, reject) => {
            geoip2.country(
                (response) => {
                    useGeoLocationStore
                        .getState()
                        .setCountryCode(response.country.iso_code);
                    resolve(response.country.iso_code);
                },
                () => {
                    reject(new Error('Cannot retrieve location'));
                }
            );
        });
    }
};

export default GeoLocationService;
