import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Modal from 'Components/Modal/Modal';
import Button from 'Components/Button/Button';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import AnalyticsService from 'Services/AnalyticsService/AnalyticsService';
import useAnalyticsStore from 'Stores/analytics/analytics.store';
import SignInForm from './SignInForm/SignInForm';
import RegistrationForm from './RegistrationForm/RegistrationForm';
import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm';
import styles from './AuthModal.module.scss';

const Views = {
    SIGN_IN: 0,
    REGISTER: 1,
    FORGOT_PASSWORD: 2,
};

function AuthModal({ selectedView, onClose }) {
    const [activeView, setActiveView] = useState(selectedView);

    const registrationStartEventSent = useAnalyticsStore(
        (state) => state.registrationStartEventSent
    );
    const setRegistrationStartEventSent = useAnalyticsStore(
        (state) => state.setRegistrationStartEventSent
    );

    useEffect(() => {
        window.recaptchaOptions = {
            useRecaptchaNet: true,
        };
    }, []);

    useEffect(() => {
        if (activeView === Views.REGISTER && !registrationStartEventSent) {
            AnalyticsService.triggerRegistrationStart();
            setRegistrationStartEventSent();
        }
    }, [activeView, registrationStartEventSent, setRegistrationStartEventSent]);

    const closeWithTimeout = () => {
        setTimeout(() => onClose(), 3000);
    };

    const giveFocus = (view) => {
        return activeView === view;
    };

    const registerViewBtnClasses = classNames({
        [styles['view-btn']]: true,
        [styles['register-view-btn']]: true,
        [styles.active]: activeView === Views.REGISTER,
    });

    const signInViewBtnClasses = classNames({
        [styles['view-btn']]: true,
        [styles['sign-in-view-btn']]: true,
        [styles.active]: activeView === Views.SIGN_IN,
    });

    return (
        <Modal
            label="Sign in or register with hbr.org"
            onClose={onClose}
            backdropClassName={styles.backdrop}
            modalClassName={styles.modal}
        >
            <Button
                variant={Button.variants.TEXT}
                className={styles['close-btn']}
                label="Close the modal dialog"
                onClick={onClose}
            >
                <SVGIcon
                    variant={SVGIcon.variants.X}
                    className={styles['close-btn-icon']}
                />
            </Button>
            <div className={styles['tab-list']}>
                <button
                    type="button"
                    className={signInViewBtnClasses}
                    onClick={() => setActiveView(Views.SIGN_IN)}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    className={registerViewBtnClasses}
                    onClick={() => setActiveView(Views.REGISTER)}
                >
                    Register
                </button>
            </div>
            {activeView === Views.SIGN_IN && (
                <SignInForm
                    onForgotPasswordClick={() =>
                        setActiveView(Views.FORGOT_PASSWORD)
                    }
                    hasFocus={giveFocus(Views.SIGN_IN)}
                    onSuccess={onClose}
                />
            )}
            {activeView === Views.REGISTER && (
                <RegistrationForm
                    hasFocus={giveFocus(Views.REGISTER)}
                    onForgotPasswordClick={() =>
                        setActiveView(Views.FORGOT_PASSWORD)
                    }
                    onSuccess={onClose}
                />
            )}
            {activeView === Views.FORGOT_PASSWORD && (
                <ForgotPasswordForm
                    hasFocus={giveFocus(Views.FORGOT_PASSWORD)}
                    onSuccess={closeWithTimeout}
                />
            )}
        </Modal>
    );
}

AuthModal.defaultProps = {
    selectedView: Views.SIGN_IN,
};

AuthModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    selectedView: PropTypes.number,
};

AuthModal.views = Views;

export default AuthModal;
