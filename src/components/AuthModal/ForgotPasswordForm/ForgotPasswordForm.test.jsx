import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import UserService from 'Services/UserService/UserService';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import HTTPError from 'Errors/HTTPError/HTTPError';
import noop from 'Helpers/noop/noop';
import renderForSWR from '../../../test-helpers/renderForSWR/renderForSWR';
import ForgotPasswordForm from './ForgotPasswordForm';

jest.mock('Services/UserService/UserService');
jest.mock('Services/CaptchaService/CaptchaService');
jest.mock('react-google-recaptcha-enterprise');

afterEach(() => {
    jest.resetAllMocks();
});

describe('<ForgotPasswordForm /> component', () => {
    beforeEach(() => {
        CaptchaService.isCaptchaEnabled.mockReturnValue(false);
    });

    it('should enable the submit button when form conditions are met', async () => {
        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus={false} />);
        const button = screen.getByRole('button', { name: /send/i });
        expect(button).toBeDisabled();
        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );
        expect(button).toBeEnabled();
    });

    it('should not enable the submit button when the captcha token is not set', async () => {
        CaptchaService.isCaptchaEnabled.mockReturnValue(true);

        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus={false} />);
        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: /send/i });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );

        expect(button).toBeDisabled();
    });

    it('should execute onSuccess', async () => {
        const successHandler = jest.fn();
        UserService.resetPassword = () => Promise.resolve(true);
        renderForSWR(
            <ForgotPasswordForm onSuccess={successHandler} hasFocus={false} />
        );

        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        expect(successHandler).toHaveBeenCalledTimes(1);
    });

    it('should notify the user when their account is not found', async () => {
        UserService.resetPassword = () => Promise.reject(new HTTPError(404));
        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus={false} />);

        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should not notify the user when an unknown error occurs', async () => {
        UserService.resetPassword = () => Promise.reject(new HTTPError(500));
        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus={false} />);

        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should notify the user when their account is locked', async () => {
        UserService.resetPassword = () => Promise.reject(new HTTPError(423));
        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus={false} />);

        await userEvent.type(
            screen.getByLabelText('Email address'),
            'jerry.garcia@hbr.org'
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should notify the user when their email address is invalid before submitting the request', () => {
        renderForSWR(<ForgotPasswordForm onSuccess={noop} hasFocus />);
        const invalidEmails = [
            'user',
            'user-@hbr.org',
            'user.@hbr.org',
            'us..er@hbr.org',
            '.user@hbr.org',
            '-user@hbr.org',
            'us^&!#er@hbr.org',
        ];

        invalidEmails.forEach(async (email) => {
            await userEvent.type(screen.getByLabelText('Email address'), email);
            await userEvent.click(
                screen.getByRole('button', { name: /send/i })
            );
            expect(screen.queryByRole('alert')).toBeInTheDocument();
        });
    });
});
