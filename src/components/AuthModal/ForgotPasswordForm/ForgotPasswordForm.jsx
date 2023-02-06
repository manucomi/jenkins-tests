import React, { useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';
import Anchor from 'Components/Anchor/Anchor';
import Button from 'Components/Button/Button';
import TextInput from 'Components/TextInput/TextInput';
import Alert from 'Components/Alert/Alert';
import Loader from 'Components/Loader/Loader';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import UserService from 'Services/UserService/UserService';
import useCreateStore from 'Hooks/useCreateStore/useCreateStore';
import HTTPError from 'Errors/HTTPError/HTTPError';
import styles from './ForgotPasswordForm.module.scss';

/* *
 * The `ForgotPasswordForm` component contains the forgot password form for
 * use exclusively in the `AuthModal`.
 *
 * @example
 * const handleSuccess = () => {
 *     // Do some stuff when the user successfully requests a password reset.
 *
 *     // Closing the modal 3 seconds after success.
 *     setTimeout(() => onClose(), 3000);
 * };
 * return (
 *     <ForgotPasswordForm
 *         hasFocus={true}
 *         onSuccess={handleSuccess}
 *         onResetPasswordRequest={handleResetPassword}
 *     />;
 * ); */

const FORGOT_PASSWORD_INITIAL_STATE = {
    emailAddress: '',
    isInvalidEmail: false,
    isAccountLocked: false,
    isLoading: false,
    isSuccess: false,
    captchaToken: null,
};

function ForgotPasswordForm({ hasFocus, onSuccess }) {
    const textField = useRef(null);
    const captchaCheckboxRef = useRef(null);
    const {
        emailAddress,
        setEmailAddress,
        isInvalidEmail,
        setIsInvalidEmail,
        isAccountLocked,
        setIsAccountLocked,
        isLoading,
        setIsLoading,
        isSuccess,
        setIsSuccess,
        captchaToken,
        setCaptchaToken,
    } = useCreateStore(FORGOT_PASSWORD_INITIAL_STATE);

    const { data: isCaptchaEnabled } = useSWR(
        CaptchaService.endpoints.ENABLED,
        CaptchaService.isCaptchaEnabled
    );

    const inputClasses = classNames({
        [styles.input]: true,
        [styles.error]: isInvalidEmail,
    });

    const handleEmailAddressChange = (event) => {
        setEmailAddress(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const emailRegex =
            /^[a-z0-9]+([.]?[-]?[_]?[+]?([a-z0-9])+)+@[a-z]+[.][a-z]{2,3}/i;
        if (!emailRegex.test(emailAddress)) {
            setIsInvalidEmail(true);
            return;
        }

        setIsInvalidEmail(false);
        setIsAccountLocked(false);
        setIsLoading(true);

        let response;

        try {
            response = await UserService.resetPassword(
                emailAddress,
                captchaToken
            );
        } catch (error) {
            if (
                error instanceof HTTPError &&
                (error.statusCode === 404 || error.statusCode === 400)
            ) {
                setIsInvalidEmail(true);
            }
            if (error instanceof HTTPError && error.statusCode === 423) {
                setIsAccountLocked(true);
            }
        } finally {
            captchaCheckboxRef.current?.reset();
            setCaptchaToken(null);
            setIsLoading(false);
        }

        if (response) {
            setIsSuccess(true);
            onSuccess();
        }
    };

    const isFormValid = () => {
        let captcha = true;

        if (isCaptchaEnabled) {
            captcha = !!captchaToken;
        }
        return captcha && emailAddress;
    };

    useEffect(() => {
        if (textField.current && hasFocus) {
            textField.current.focus();
        }
    }, [textField, hasFocus]);

    useEffect(() => {
        if (textField.current && isInvalidEmail) {
            textField.current.focus();
        }
    }, [textField, isInvalidEmail]);

    const onVerify = useCallback(
        (token) => setCaptchaToken(token),
        [setCaptchaToken]
    );

    const onExpire = useCallback(
        () => setCaptchaToken(null),
        [setCaptchaToken]
    );

    return (
        <>
            <p className={styles.text}>
                Enter the email address used to create your account to receive a
                password reset link.
            </p>
            <form
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                data-qa="forgot-password-form"
            >
                <TextInput
                    variant={TextInput.variants.EMAIL}
                    name="emailAddress"
                    label="Email address"
                    placeholder="EMAIL"
                    textInputClassName={inputClasses}
                    labelClassName={styles.label}
                    onChange={handleEmailAddressChange}
                    ref={textField}
                />
                <Alert
                    className={styles['error-message']}
                    active={isInvalidEmail}
                    intrusive
                >
                    Please enter a valid email address.
                </Alert>
                <Alert
                    className={styles['error-message']}
                    active={isAccountLocked}
                    intrusive
                >
                    You cannot unlock your account by resetting the password.
                    Please wait 24 hours to unlock and try again. For immediate
                    assistance, please contact{' '}
                    <Anchor href="/subscriber-help#contact-customer-service">
                        Customer Service
                    </Anchor>
                    .
                </Alert>
                {isCaptchaEnabled && (
                    <ReCAPTCHA
                        className={styles.captcha}
                        onExpired={onExpire}
                        onChange={onVerify}
                        ref={captchaCheckboxRef}
                        sitekey={CaptchaService.keys.CHECKBOX}
                    />
                )}
                {isLoading && <Loader className={styles.loader} />}
                {!isLoading && !isSuccess && (
                    <Button
                        variant={Button.variants.PRIMARY}
                        label="Send a password reset request"
                        className={styles.btn}
                        disabled={!isFormValid()}
                        submit
                    >
                        Send
                    </Button>
                )}
                <Alert className={styles.text} active={isSuccess}>
                    If your email is registered with us, you will receive an
                    email with a link to reset your password.
                </Alert>
            </form>
        </>
    );
}

ForgotPasswordForm.propTypes = {
    hasFocus: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
