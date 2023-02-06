import '@testing-library/jest-dom/extend-expect';
import { screen, waitFor } from '@testing-library/react';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import React from 'react';
import UserService from 'Services/UserService/UserService';
import userEvent from '@testing-library/user-event';
import noop from 'Helpers/noop/noop';
import HTTPError from 'Errors/HTTPError/HTTPError';
import SignInForm from './SignInForm';
import renderForSWR from '../../../test-helpers/renderForSWR/renderForSWR';

const userProfile = { id: 345, firstName: 'Jerry', lastName: 'Garcia' };

jest.mock('react-google-recaptcha-enterprise');
jest.mock('Services/UserService/UserService');
jest.mock('Services/CaptchaService/CaptchaService');
jest.mock('Domains/DataLayer/DataLayer', () => {
    return function dataLayerMock() {
        return {
            init: () => Promise.resolve(),
            setSignInEvent: () => {},
            updateUsers: () => {},
            updateEvent: () => {},
        };
    };
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('<SignInForm /> component', () => {
    it('should focus the email input on render', async () => {
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={jest.fn()}
                hasFocus
            />
        );
        expect(screen.getByLabelText(/email address/i)).toHaveFocus();
    });
    it('should execute onSuccess on successful authentication', async () => {
        const successHandler = jest.fn();
        UserService.authenticate.mockResolvedValueOnce(true);
        UserService.getProfile.mockResolvedValueOnce(userProfile);
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );
        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        await userEvent.click(button);
        expect(successHandler).toHaveBeenCalledTimes(1);
    });

    it('should enable the submit button when form conditions are met', async () => {
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );
        expect(button).toBeDisabled();

        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        expect(button).toBeEnabled();
    });

    it('should not enable the submit button when the captcha token is not set', async () => {
        CaptchaService.isCaptchaEnabled.mockResolvedValueOnce(true);
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );
        expect(button).toBeDisabled();

        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        expect(button).toBeDisabled();
    });

    it('should notify the user of sign in errors', async () => {
        UserService.authenticate.mockRejectedValueOnce(new HTTPError(400));
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );

        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        await userEvent.click(button);
        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should notify the user is locked out', async () => {
        const errData = { field: 'lockout_duration', errorMessage: '3600s' };
        UserService.authenticate.mockRejectedValueOnce(
            new HTTPError(400, errData)
        );
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );

        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        await userEvent.click(button);
        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should not notify the user of unknown sign in errors', async () => {
        UserService.authenticate.mockRejectedValueOnce(new HTTPError(500));
        renderForSWR(
            <SignInForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /sign in/i });
            expect(button).toBeInTheDocument();
        });

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'jerry.garcia@hbr.org'
        );

        await userEvent.type(screen.getByLabelText(/password/i), 'password');
        await userEvent.click(button);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
