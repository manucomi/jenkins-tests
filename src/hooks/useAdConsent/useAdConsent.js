/* global __tcfapi */
import { useEffect, useState } from 'react';

/**
 * A React hook that taps into Google's Funding Choices service to prompt users
 * in the EU for their consent to view ads. It expects that the script has been injected in the consumer app.
 *
 * @returns {boolean} - The value of isAdConsented based on whether the EU user grants us permission to display ads.
 */
const useAdConsent = () => {
    const [isAdConsented, setisAdConsented] = useState(null);

    useEffect(() => {
        window.googlefc = window.googlefc || {};
        window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

        // Queue the callback on the callbackQueue.
        window.googlefc.callbackQueue.push({
            CONSENT_DATA_READY: () => {
                const callback = (tcData, success) => {
                    const { gdprApplies, eventStatus, listenerId } = tcData;

                    if (
                        success === true &&
                        (eventStatus === 'useractioncomplete' ||
                            eventStatus === 'tcloaded') &&
                        gdprApplies === true
                    ) {
                        const { consents } = tcData.purpose;
                        const consentsArray = Object.values(consents);
                        // Removing duplicates
                        const consentOuput = consentsArray.reduce(
                            (prev, cur) => {
                                if (prev.indexOf(cur) === -1) {
                                    prev.push(cur);
                                }
                                return prev;
                            },
                            []
                        );

                        // Remove so as to not get called more than once
                        // eslint-disable-next-line no-underscore-dangle
                        __tcfapi(
                            'removeEventListener',
                            2,
                            () => {
                                return true;
                            },
                            listenerId
                        );

                        // Validating consents
                        // We're expecting to get all the reponses as true
                        // If we receive false or mixed response
                        // By design we consider this as not consent
                        if (
                            consentOuput.length === 1 &&
                            consentOuput[0] === true
                        ) {
                            setisAdConsented(true);
                        } else {
                            setisAdConsented(false);
                        }
                    } else if (gdprApplies === false) {
                        setisAdConsented(true);
                    }
                };

                // eslint-disable-next-line no-underscore-dangle
                __tcfapi('addEventListener', 2, callback);
            },
        });
    }, []);

    return isAdConsented;
};

export default useAdConsent;
