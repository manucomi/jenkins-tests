import React, { useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';
import Button from 'Components/Button/Button';
import TextInput from 'Components/TextInput/TextInput';
import Anchor from 'Components/Anchor/Anchor';
import Alert from 'Components/Alert/Alert';
import Loader from 'Components/Loader/Loader';
import UserService from 'Services/UserService/UserService';
import AnalyticsService from 'Services/AnalyticsService/AnalyticsService';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import GeoLocationService from 'Services/GeoLocationService/GeoLocationService';
import useCreateStore from 'Hooks/useCreateStore/useCreateStore';
import DataLayer from 'Domains/DataLayer/DataLayer';
import HTTPError from 'Errors/HTTPError/HTTPError';
import styles from './RegistrationForm.module.scss';

const Errors = {
    INVALID_EMAIL: 'email',
    INVALID_PASS: 'password',
    DUPLICATE: 'dupe',
    FIRST_NAME_SIZE: 'first name too big',
    LAST_NAME_SIZE: 'last name too big',
};

/**
 * The `RegistrationForm` component contains the registration form for use
 * exclusively in the `AuthModal`.
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
 *     <RegistrationForm
 *         hasFocus={true}
 *         onForgotPasswordClick={handleForgotPasswordClick}
 *         onSuccess={handleSuccess}
 *         onGetUserSubscriptionByEmail={handleGetSubscription}
 *         onCreateUserRequest={handleCreateUser}
 *     />
 * );
 */

const REGISTRATION_INITIAL_STATE = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    formError: {},
    isUnauthorized: false,
    errorResponse: {},
    isLoading: false,
    captchaToken: null,
    optIn: false,
};

function RegistrationForm({ hasFocus, onForgotPasswordClick, onSuccess }) {
    const firstNameField = useRef(null);
    const lastNameField = useRef(null);
    const emailAddressField = useRef(null);
    const passwordField = useRef(null);
    const captchaCheckboxRef = useRef(null);
    const {
        formError,
        setFormError,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        emailAddress,
        setEmailAddress,
        password,
        setPassword,
        isLoading,
        setIsLoading,
        captchaToken,
        setCaptchaToken,
        optIn,
        setOptIn,
    } = useCreateStore(REGISTRATION_INITIAL_STATE);

    const { data: isCaptchaEnabled } = useSWR(
        CaptchaService.endpoints.ENABLED,
        CaptchaService.isCaptchaEnabled
    );

    const { data: isUSUser } = useSWR(
        GeoLocationService?.isUSUser?.name,
        GeoLocationService?.isUSUser
    );

    const emailInputClasses = classNames({
        [styles.input]: true,
        [styles.error]:
            formError === Errors.INVALID_EMAIL ||
            formError === Errors.DUPLICATE,
    });

    const passwordInputClasses = classNames({
        [styles.input]: true,
        [styles.error]: formError === Errors.INVALID_PASS,
    });

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailAddressChange = (event) => {
        setEmailAddress(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const isFormValid = () => {
        let captcha = true;

        if (isCaptchaEnabled) {
            captcha = !!captchaToken;
        }

        return captcha && password && emailAddress && firstName && lastName;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError({});
        setIsLoading(true);

        let isSubscriptionFound;

        try {
            await UserService.getSubscription(emailAddress);
            isSubscriptionFound = true;
        } catch (error) {
            isSubscriptionFound = false;
        }

        if (isSubscriptionFound) {
            const encodedEmailAddress = encodeURIComponent(emailAddress);
            window.location.href = `/subscriber-registration?emailAddress=${encodedEmailAddress}`;
        } else {
            let user;

            try {
                user = await UserService.create(
                    firstName,
                    lastName,
                    emailAddress,
                    password,
                    isUSUser ? true : optIn,
                    captchaToken
                );
            } catch (error) {
                AnalyticsService.triggerRegistrationFail();
                if (error instanceof HTTPError) {
                    if (error.statusCode === 400) {
                        const setErrorState = (errorField) =>
                            setFormError({
                                field: errorField,
                                message: error?.data?.errorMessage,
                            });

                        switch (error.data.field) {
                            case 'emailAddress':
                                setErrorState(Errors.INVALID_EMAIL);
                                break;
                            case 'password':
                                setErrorState(Errors.INVALID_PASS);
                                break;
                            case 'firstName':
                                setErrorState(Errors.FIRST_NAME_SIZE);
                                break;
                            case 'lastName':
                                setErrorState(Errors.LAST_NAME_SIZE);
                                break;
                            default:
                                setFormError({});
                        }
                    }

                    if (error.statusCode === 409) {
                        setFormError({
                            field: Errors.DUPLICATE,
                            message: (
                                <>
                                    {emailAddress} is already registered. Please
                                    choose another email address or{' '}
                                    <Button
                                        onClick={onForgotPasswordClick}
                                        variant={Button.variants.TEXT}
                                    >
                                        reset your password
                                    </Button>
                                </>
                            ),
                        });
                    }
                }
            } finally {
                captchaCheckboxRef.current?.reset();
                setCaptchaToken(null);
                setIsLoading(false);
            }

            if (user) {
                const dataLayer = new DataLayer();
                dataLayer.init().then(() => {
                    dataLayer.setRegistrationEvent();
                    dataLayer.updateUsers();
                    dataLayer.updateEvent();
                });
                AnalyticsService.triggerRegistrationSuccess();
                onSuccess();
            }
        }
    };

    useEffect(() => {
        if (hasFocus) {
            firstNameField?.current?.focus();
        }
    }, [firstNameField, hasFocus]);

    useEffect(() => {
        if (formError?.field === Errors.INVALID_EMAIL) {
            emailAddressField.current?.focus();
        }

        if (formError?.field === Errors.INVALID_PASS) {
            passwordField.current?.focus();
        }

        if (formError?.field === Errors.FIRST_NAME_SIZE) {
            firstNameField.current?.focus();
        }

        if (formError?.field === Errors.LAST_NAME_SIZE) {
            lastNameField.current?.focus();
        }
    }, [
        formError,
        emailAddressField,
        passwordField,
        firstNameField,
        lastNameField,
    ]);

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
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                data-qa="registration-form"
            >
                <TextInput
                    textInputClassName={styles.input}
                    labelClassName={styles.label}
                    label="First name"
                    name="firstName"
                    onChange={handleFirstNameChange}
                    placeholder="FIRST NAME"
                    ref={firstNameField}
                    variant={TextInput.variants.TEXT}
                />
                <Alert
                    className={styles['error-message']}
                    active={formError?.field === Errors.FIRST_NAME_SIZE}
                    intrusive
                >
                    {formError?.message}
                </Alert>
                <TextInput
                    textInputClassName={styles.input}
                    labelClassName={styles.label}
                    label="Last name"
                    name="lastName"
                    onChange={handleLastNameChange}
                    placeholder="LAST NAME"
                    ref={lastNameField}
                    variant={TextInput.variants.TEXT}
                />
                <Alert
                    className={styles['error-message']}
                    active={formError?.field === Errors.LAST_NAME_SIZE}
                    intrusive
                >
                    {formError?.message}
                </Alert>
                <TextInput
                    textInputClassName={emailInputClasses}
                    labelClassName={styles.label}
                    label="Email address"
                    name="emailAddress"
                    onChange={handleEmailAddressChange}
                    placeholder="EMAIL"
                    ref={emailAddressField}
                    variant={TextInput.variants.EMAIL}
                />
                <Alert
                    className={styles['error-message']}
                    active={formError?.field === Errors.INVALID_EMAIL}
                    intrusive
                >
                    {formError?.message}
                </Alert>
                <Alert
                    className={styles['error-message']}
                    active={formError?.field === Errors.DUPLICATE}
                    intrusive
                >
                    {formError?.message}
                </Alert>
                <TextInput
                    textInputClassName={passwordInputClasses}
                    labelClassName={styles.label}
                    label="Password"
                    name="password"
                    onChange={handlePasswordChange}
                    placeholder="PASSWORD"
                    ref={passwordField}
                    variant={TextInput.variants.PASSWORD}
                />
                <Alert
                    className={styles['error-message']}
                    active={formError?.field === Errors.INVALID_PASS}
                    intrusive
                >
                    {formError?.message}
                </Alert>
                {isUSUser ? (
                    <p className={styles['opt-in-message']}>
                        By registering, you agree to receive occasional emails
                        from HBR. You may unsubscribe at any time.
                    </p>
                ) : (
                    <div className={styles['opt-in-message']}>
                        <label
                            htmlFor="optInCheckbox"
                            className={styles['opt-in-label']}
                        >
                            <input
                                type="checkbox"
                                onChange={(event) =>
                                    setOptIn(event.target.checked)
                                }
                                checked={optIn}
                                className={styles['opt-in-checkbox']}
                                id="optInCheckbox"
                            />
                            Sign up to receive occasional emails from HBR. You
                            may unsubscribe at any time.
                        </label>
                    </div>
                )}
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
                        disabled={!isFormValid()}
                        variant={Button.variants.PRIMARY}
                        submit
                    >
                        Register
                    </Button>
                )}
            </form>
            <div className={styles['link-container']}>
                <Anchor
                    href="/subscriber-registration"
                    className={`${styles.link} ${styles['link-red']}`}
                >
                    Paid Subscribers Register Here
                </Anchor>
                <Anchor
                    href="/privacy-policy"
                    className={`${styles.link} ${styles['link-black']}`}
                >
                    View Privacy Policy
                </Anchor>
            </div>
        </>
    );
}

RegistrationForm.propTypes = {
    hasFocus: PropTypes.bool.isRequired,
    onForgotPasswordClick: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default RegistrationForm;
