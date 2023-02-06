import { renderHook } from '@testing-library/react';
import useAdConsent from './useAdConsent';

let mockTCData;

beforeEach(() => {
    window.googlefc = {
        callbackQueue: {
            push: (item) => {
                item.CONSENT_DATA_READY();
            },
        },
    };

    mockTCData = {
        gdprApplies: true,
        eventStatus: 'tcloaded',
        purpose: {
            consents: [true],
        },
    };
});

describe('useAdConsent hook', () => {
    it('should return true if GDRP applies and consent was given', () => {
        mockTCData.gdprApplies = true;

        // eslint-disable-next-line no-underscore-dangle
        window.__tcfapi = (eventType, version, callback) => {
            callback(mockTCData, true);
        };

        const { result } = renderHook(() => useAdConsent());
        expect(result.current).toEqual(true);
    });

    it('should return false if at least one value from the consent array returns false', () => {
        mockTCData.purpose.consents = [false, false];

        const { result } = renderHook(() => useAdConsent());
        expect(result.current).toEqual(false);
    });

    it('should return false if GDPR does apply, but consent was not given', () => {
        mockTCData.gdprApplies = true;
        mockTCData.purpose.consents = [false];

        // eslint-disable-next-line no-underscore-dangle
        window.__tcfapi = (eventType, version, callback) => {
            callback(mockTCData, true);
        };

        const { result } = renderHook(() => useAdConsent());
        expect(result.current).toEqual(false);
    });

    it('should return true if GDPR does not apply', () => {
        mockTCData.gdprApplies = false;
        mockTCData.eventStatus = '';

        // eslint-disable-next-line no-underscore-dangle
        window.__tcfapi = (eventType, version, callback) => {
            callback(mockTCData, false);
        };

        const { result } = renderHook(() => useAdConsent());
        expect(result.current).toEqual(true);
    });

    it('should push onto the callbackQueue', () => {
        window.googlefc = undefined;
        renderHook(() => useAdConsent());
        expect(window.googlefc.callbackQueue).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    CONSENT_DATA_READY: expect.any(Function),
                }),
            ])
        );
    });

    it('should return false when the consent platform fails', () => {
        // eslint-disable-next-line no-underscore-dangle
        window.__tcfapi = (eventType, version, callback) => {
            callback(mockTCData, false);
        };

        const { result } = renderHook(() => useAdConsent());
        expect(result.current).toBeNull();
    });
});
