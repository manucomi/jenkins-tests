import AnalyticsService from './AnalyticsService';

describe('AnalyticsService', () => {
    describe('#triggerSignInSuccess()', () => {
        it('should dispatch a custom event', () => {
            let triggered = false;
            document.body.addEventListener('metrics:signin_success', () => {
                triggered = true;
            });
            AnalyticsService.triggerSignInSuccess();
            expect(triggered).toBe(true);
        });
    });

    describe('#triggerRegistrationStart()', () => {
        it('should dispatch a custom event', () => {
            let triggered = false;
            document.body.addEventListener('metrics:registration_start', () => {
                triggered = true;
            });
            AnalyticsService.triggerRegistrationStart();
            expect(triggered).toBe(true);
        });
    });

    describe('#triggerRegistrationFail()', () => {
        it('should dispatch a custom event', () => {
            let triggered = false;
            document.body.addEventListener(
                'metrics:registration_failure',
                () => {
                    triggered = true;
                }
            );
            AnalyticsService.triggerRegistrationFail();
            expect(triggered).toBe(true);
        });
    });

    describe('#triggerRegistrationSuccess()', () => {
        it('should dispatch a custom event', () => {
            let triggered = false;
            document.body.addEventListener(
                'metrics:registration_success',
                () => {
                    triggered = true;
                }
            );
            AnalyticsService.triggerRegistrationSuccess();
            expect(triggered).toBe(true);
        });
    });
});
