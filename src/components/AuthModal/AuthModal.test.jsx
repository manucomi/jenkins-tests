import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsService from 'Services/AnalyticsService/AnalyticsService';
import noop from 'Helpers/noop/noop';
import '@testing-library/jest-dom/extend-expect';
import AuthModal from './AuthModal';

jest.mock('focus-trap-react');
jest.mock('./SignInForm/SignInForm', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function signInFormMock({ onForgotPasswordClick }) {
            return (
                <>
                    <button onClick={onForgotPasswordClick} type="button">
                        forgot password
                    </button>
                    <button type="button">trigger sign in</button>
                </>
            );
        },
    };
});
jest.mock('./RegistrationForm/RegistrationForm', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function registrationFormMock({ onForgotPasswordClick }) {
            return (
                <>
                    <button onClick={onForgotPasswordClick} type="button">
                        forgot password
                    </button>
                    <button type="button">trigger register</button>
                </>
            );
        },
    };
});
jest.mock('./ForgotPasswordForm/ForgotPasswordForm', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function forgotPasswordFormMock({ onSuccess }) {
            return (
                <button onClick={onSuccess} type="button">
                    trigger reset password
                </button>
            );
        },
    };
});
jest.mock('Services/AnalyticsService/AnalyticsService');

describe('<AuthModal /> component', () => {
    it('should render a modal', () => {
        render(<AuthModal onClose={noop} />);
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    it('should only trigger the registration start analytics event once', async () => {
        const expectRegistration = () => {
            expect(
                screen.queryByRole('button', { name: /trigger register/i })
            ).toBeInTheDocument();
            expect(
                AnalyticsService.triggerRegistrationStart
            ).toHaveBeenCalledTimes(1);
        };

        const { rerender } = render(
            <AuthModal onClose={noop} selectedView={AuthModal.views.REGISTER} />
        );
        expectRegistration();

        await userEvent.click(
            screen.getByRole('button', { name: /^sign in/i })
        );
        expect(
            screen.queryByRole('button', { name: /trigger sign in/i })
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: /^register/i })
        );
        expectRegistration();

        rerender(
            <AuthModal onClose={noop} selectedView={AuthModal.views.REGISTER} />
        );
        expectRegistration();
    });

    it('should render with the registration view displayed', () => {
        render(
            <AuthModal onClose={noop} selectedView={AuthModal.views.REGISTER} />
        );
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /^register/i }));
    });

    it('should set the selected view', async () => {
        render(<AuthModal onClose={noop} />);
        expect(
            screen.queryByRole('button', { name: /^sign in/i })
        ).toBeInTheDocument();
        await userEvent.click(
            screen.getByRole('button', { name: /^register/i })
        );
        expect(
            screen.queryByRole('button', { name: /trigger register/i })
        ).toBeInTheDocument();
        await userEvent.click(
            screen.getByRole('button', { name: /forgot password/i })
        );
        expect(
            screen.queryByRole('button', {
                name: /trigger reset password/i,
            })
        ).toBeInTheDocument();
        await userEvent.click(
            screen.getByRole('button', { name: /^sign in/i })
        );
        expect(
            screen.queryByRole('button', { name: /trigger sign in/i })
        ).toBeInTheDocument();
        await userEvent.click(
            screen.getByRole('button', { name: /forgot password/i })
        );
        expect(
            screen.queryByRole('button', {
                name: /trigger reset password/i,
            })
        ).toBeInTheDocument();
    });

    it('should close the modal', async () => {
        const mockClose = jest.fn();
        render(
            <AuthModal
                onClose={mockClose}
                selectedView={AuthModal.views.FORGOT_PASSWORD}
            />
        );
        await userEvent.click(
            screen.getByRole('button', { name: /trigger reset password/i })
        );
        await waitFor(
            () => {
                expect(mockClose).toHaveBeenCalledTimes(1);
            },
            { timeout: 3500 }
        );
    });
});
