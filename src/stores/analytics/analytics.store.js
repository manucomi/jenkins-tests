import create from 'zustand';

const useAnalyticsStore = create((set) => ({
    registrationStartEventSent: false,
    setRegistrationStartEventSent: () =>
        set(() => ({ registrationStartEventSent: true })),
}));

export default useAnalyticsStore;
