/**
 * This class defines static methods for interacting with analytics providers.
 */
const AnalyticsService = class {
    /**
     * Dispatches a custom event indicating authentication was successful.
     */
    static triggerSignInSuccess() {
        const event = new CustomEvent('metrics:signin_success', {
            bubbles: true,
        });
        document.body.dispatchEvent(event);
    }

    /**
     * Dispatches a custom event indicating the user has started registering.
     */
    static triggerRegistrationStart() {
        const event = new CustomEvent('metrics:registration_start', {
            bubbles: true,
        });
        document.body.dispatchEvent(event);
    }

    /**
     * Dispatches a custom event indicating user registration has failed.
     */
    static triggerRegistrationFail() {
        const event = new CustomEvent('metrics:registration_failure', {
            bubbles: true,
        });
        document.body.dispatchEvent(event);
    }

    /**
     * Dispatches a custom event indicating user registration succeeded.
     */
    static triggerRegistrationSuccess() {
        const event = new CustomEvent('metrics:registration_success', {
            bubbles: true,
        });
        document.body.dispatchEvent(event);
    }
};

export default AnalyticsService;
