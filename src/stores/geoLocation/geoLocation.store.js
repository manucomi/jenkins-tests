import create from 'zustand';

const useGeoLocationStore = create((set) => ({
    countryCode: null,
    setCountryCode: (countryCode) => {
        set(() => ({
            countryCode,
        }));
    },
}));

export default useGeoLocationStore;
