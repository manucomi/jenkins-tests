import useAnalyticsStore from './analytics.store';

describe('analytics store', () => {
    it('should set registrationStartEventSent to true', () => {
        expect(useAnalyticsStore.getState().registrationStartEventSent).toBe(
            false
        );
        useAnalyticsStore.getState().setRegistrationStartEventSent();
        expect(useAnalyticsStore.getState().registrationStartEventSent).toBe(
            true
        );
    });
});
