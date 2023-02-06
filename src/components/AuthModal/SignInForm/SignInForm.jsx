import React, { useCallback, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';
import useSWR from 'swr';
import Anchor from 'Components/Anchor/Anchor';
import Button from 'Components/Button/Button';
import TextInput from 'Components/TextInput/TextInput';
import Loader from 'Components/Loader/Loader';
import Alert from 'Components/Alert/Alert';
import UserService from 'Services/UserService/UserService';
import AnalyticsService from 'Services/AnalyticsService/AnalyticsService';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import useCreateStore from 'Hooks/useCreateStore/useCreateStore';
import DataLayer from 'Domains/DataLayer/DataLayer';
import HTTPError from 'Errors/HTTPError/HTTPError';
import convertTimeDuration from 'Helpers/convertTimeDuration/convertTimeDuration';
import styles from './SignInForm.module.scss';

/**
 * The `SignInForm` component contains the sign-in form for use exclusively
 * in the `AuthModal`.
 *
 * @example
 * const handleSuccess = () => {
 *     // Do some stuff when the user successfully registers.
 *
 *     // Closing the modal 3 seconds after success.
 *     setTimeout(() => onClose(), 3000);
 * };
 * const handleForgotPasswordClick = () => setActiveView(Views.FORGOT_PASS);
 * return (
 *     <SignInForm
 *         hasFocus={true}
 *     />
 * );
 */
const SIGN_IN_INITIAL_STATE = {
    username: '',
    password: '',
    isUnauthorized: false,
    errorResponse: {},
    isLoading: false,
    captchaToken: null,
};

function SignInForm({ onForgotPasswordClick, onSuccess, hasFocus }) {
    const emailField = useRef(null);
    const captchaCheckboxRef = useRef(null);
    const {
        username,
        setUsername,
        password,
        setPassword,
        isUnauthorized,
        setIsUnauthorized,
        errorResponse,
        setErrorResponse,
        isLoading,
        setIsLoading,
        captchaToken,
        setCaptchaToken,
    } = useCreateStore(SIGN_IN_INITIAL_STATE);

    const { data: isCaptchaEnabled } = useSWR(
        CaptchaService.endpoints.ENABLED,
        CaptchaService.isCaptchaEnabled
    );

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const isFormValid = () => {
        let captcha = true;

        if (isCaptchaEnabled) {
            captcha = !!captchaToken;
        }

        return captcha && username && password;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUnauthorized(false);
        setErrorResponse({});
        setIsLoading(true);

        let authentication;
        let userProfile;

        try {
            authentication = await UserService.authenticate(
                username,
                password,
                captchaToken
            );
            userProfile = await UserService.getProfile();
        } catch (error) {
            if (error instanceof HTTPError && error.statusCode === 400) {
                if (error.data?.field) {
                    setErrorResponse(error.data);
                } else setIsUnauthorized(true);
            }
        } finally {
            captchaCheckboxRef.current?.reset();
            setCaptchaToken(null);
            setIsLoading(false);
        }

        if (authentication && userProfile) {
            const dataLayer = new DataLayer();
            dataLayer.init().then(() => {
                dataLayer.setSignInEvent();
                dataLayer.updateUsers();
                dataLayer.updateEvent();
                AnalyticsService.triggerSignInSuccess();
            });
            onSuccess();
        }
    };

    useEffect(() => {
        if (hasFocus) {
            emailField?.current?.focus();
        }
    }, [emailField, hasFocus]);

    useEffect(() => {
        if (isUnauthorized) {
            emailField?.current?.focus();
        }
    }, [emailField, isUnauthorized]);

    const onVerify = useCallback(
        (token) => setCaptchaToken(token),
        [setCaptchaToken]
    );

    const onExpire = useCallback(
        () => setCaptchaToken(null),
        [setCaptchaToken]
    );

    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit}
            noValidate
            data-qa="sign-in-form"
        >
            <Alert active={isUnauthorized} className={styles.notice} intrusive>
                You have entered an invalid email and password combination
            </Alert>
            <Alert
                active={errorResponse.field === 'tries_left'}
                className={styles.notice}
                intrusive
            >
                You have entered an invalid email and password combination.
                Please try again. You have {errorResponse.errorMessage}
                {errorResponse.errorMessage === 1 ? ' try ' : ' tries '} left.
            </Alert>
            <Alert
                active={errorResponse.field === 'lockout_duration'}
                className={styles.notice}
                intrusive
            >
                Your account is blocked, please wait{' '}
                {convertTimeDuration(errorResponse.errorMessage)} to unlock and
                try again. For immediate assistance, please contact{' '}
                <Anchor href="/subscriber-help#contact-customer-service">
                    Customer Service
                </Anchor>
                .
            </Alert>
            <TextInput
                textInputClassName={styles.input}
                labelClassName={styles.label}
                label="Email address"
                name="emailAddress"
                placeholder="EMAIL"
                variant={TextInput.variants.EMAIL}
                onChange={handleUsernameChange}
                ref={emailField}
            />
            <TextInput
                textInputClassName={styles.input}
                labelClassName={styles.label}
                label="Password"
                name="password"
                placeholder="PASSWORD"
                variant={TextInput.variants.PASSWORD}
                onChange={handlePasswordChange}
            />
            {isCaptchaEnabled && (
                <ReCAPTCHA
                    className={styles.captcha}
                    onExpired={onExpire}
                    onChange={onVerify}
                    ref={captchaCheckboxRef}
                    sitekey={CaptchaService?.keys?.CHECKBOX}
                />
            )}
            {isLoading ? (
                <Loader className={styles.loader} />
            ) : (
                <Button
                    className={styles.btn}
                    variant={Button.variants.PRIMARY}
                    submit
                    disabled={!isFormValid()}
                >
                    Sign In
                </Button>
            )}
            <Button
                variant={Button.variants.TEXT}
                className={styles['forgot-password-btn']}
                onClick={onForgotPasswordClick}
            >
                Forgot password?
            </Button>
        </form>
    );
}

SignInForm.propTypes = {
    hasFocus: PropTypes.bool.isRequired,
    onForgotPasswordClick: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default SignInForm;
