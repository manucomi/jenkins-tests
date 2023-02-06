/* eslint-disable react/prop-types */
import React, { forwardRef, useEffect } from 'react';

/**
 * This is a mock for the recaptcha-enterprise module.
 *
 * @example
 * jest.mock('react-google-recaptcha-enterprise');
 */
const ReCAPTCHA = forwardRef(function ReCAPTCHAComponent(
    { onChange, onExpired },
    ref
) {
    useEffect(() => {
        if (onChange) {
            onChange('mockToken');
        }
    }, [onChange]);

    useEffect(() => {
        if (onExpired) {
            onExpired();
        }
    }, [onExpired]);

    return <div ref={ref}>recaptcha</div>;
});

export default ReCAPTCHA;
