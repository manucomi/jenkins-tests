import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import UserService from 'Services/UserService/UserService';
import GeoLocationService from 'Services/GeoLocationService/GeoLocationService';
import CaptchaService from 'Services/CaptchaService/CaptchaService';
import HTTPError from 'Errors/HTTPError/HTTPError';
import noop from 'Helpers/noop/noop';
import renderForSWR from '../../../test-helpers/renderForSWR/renderForSWR';
import RegistrationForm from './RegistrationForm';

jest.mock('react-google-recaptcha-enterprise');
jest.mock('Services/UserService/UserService');
jest.mock('Services/CaptchaService/CaptchaService');
jest.mock('Services/GeoLocationService/GeoLocationService');
jest.mock('Domains/DataLayer/DataLayer', () => {
    return function dataLayerMock() {
        return {
            init: () => Promise.resolve(),
            setRegistrationEvent: () => {},
            updateUsers: () => {},
            updateEvent: () => {},
        };
    };
});

const fillOutForm = async (firstName, lastName, emailAddress, password) => {
    await userEvent.type(screen.getByLabelText(/first name/i), firstName);
    await userEvent.type(screen.getByLabelText(/last name/i), lastName);
    await userEvent.type(screen.getByLabelText(/email address/i), emailAddress);
    await userEvent.type(screen.getByLabelText(/password/i), password);
};

const expectAlertNotToBeEmpty = (alerts, theOneThatIsNotEmpty) => {
    alerts.forEach((alert, index) => {
        if (index === theOneThatIsNotEmpty) {
            expect(alert).not.toBeInTheDocument();
        } else {
            expect(alert).toBeInTheDocument();
        }
    });
};

beforeEach(() => {
    GeoLocationService.isUSUser.mockReturnValue(true);
    UserService.getSubscription.mockRejectedValue(new HTTPError(404));
});
afterEach(async () => {
    jest.resetAllMocks();
});

describe('<RegistrationForm /> component', () => {
    it('should redirect when a subscription is found', async () => {
        global.window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: '',
            },
            writable: true,
        });

        UserService.getSubscription.mockResolvedValueOnce(true);
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);

        expect(window.location.href).toEqual(
            expect.stringContaining('/subscriber-registration?emailAddress=')
        );
    });

    it('should check the opt in checkbox', async () => {
        GeoLocationService.isUSUser.mockReturnValue(false);

        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        const checkbox = await screen.findByRole('checkbox');

        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        await userEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();

        await userEvent.click(screen.getByLabelText(/^sign up/i));
        expect(checkbox).toBeChecked();
    });

    it('should notify the user of invalid email address', async () => {
        GeoLocationService.isUSUser.mockReturnValue(false);
        UserService.create.mockRejectedValueOnce(
            new HTTPError(400, { field: 'emailAddress' })
        );
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm('Jerry', 'Garcia', 'jerry.garcia', 'p@SSw0rD');
        expect(button).toBeEnabled();

        await userEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('textbox', { name: /Email address/ })
            ).toHaveFocus();
        });

        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), 2);
    });

    it('should execute onSuccess on successful registration', async () => {
        const userProfile = { id: 345, firstName: 'Jerry', lastName: 'Garcia' };
        UserService.create.mockResolvedValueOnce(userProfile);

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);

        expect(successHandler).toHaveBeenCalledTimes(1);
    });

    it('should not enable the registration button when the captcha token is not set', async () => {
        CaptchaService.isCaptchaEnabled.mockResolvedValueOnce(true);

        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );

        expect(button).toBeDisabled();
    });

    it('should notify the user of invalid password', async () => {
        UserService.create.mockRejectedValueOnce(
            new HTTPError(400, { field: 'password' })
        );

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByLabelText(/Password/)).toHaveFocus();
        });

        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), 4);
    });

    it('should notify the user when they already have an account', async () => {
        UserService.create.mockRejectedValueOnce(new HTTPError(409));

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );
        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);
        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), 3);
    });

    it('should notify the user when the first name is invalid', async () => {
        UserService.create.mockRejectedValueOnce(
            new HTTPError(400, { field: 'firstName' })
        );

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);
        await waitFor(() => {
            expect(
                screen.getByRole('textbox', { name: /First name/ })
            ).toHaveFocus();
        });

        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), 0);
    });

    it('should notify the user when the last name is invalid', async () => {
        UserService.create.mockRejectedValueOnce(
            new HTTPError(400, { field: 'lastName' })
        );

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('textbox', { name: /Last name/ })
            ).toHaveFocus();
        });

        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), 1);
    });

    it('should handle unknown form errors', async () => {
        UserService.create.mockRejectedValueOnce(
            new HTTPError(400, { field: 'error' })
        );

        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);
        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), -1);
    });

    it('should not notify when an unknown error occurs', async () => {
        UserService.create.mockRejectedValueOnce(new Error('IDK'));
        const successHandler = jest.fn();
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={successHandler}
                hasFocus={false}
            />
        );

        let button;
        await waitFor(() => {
            button = screen.queryByRole('button', { name: 'Register' });
            expect(button).toBeInTheDocument();
        });
        expect(button).toBeDisabled();

        await fillOutForm(
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'p@SSw0rD'
        );
        expect(button).toBeEnabled();

        await userEvent.click(button);
        expectAlertNotToBeEmpty(screen.queryAllByRole('alert'), -1);
    });

    it('should give non US users the choice to opt in', async () => {
        GeoLocationService.isUSUser.mockResolvedValueOnce(false);

        const successHandler = jest.fn();
        await act(async () =>
            renderForSWR(
                <RegistrationForm
                    onForgotPasswordClick={noop}
                    onSuccess={successHandler}
                    hasFocus={false}
                />
            )
        );

        expect(
            await screen.findByRole('checkbox', { name: /^sign up/i })
        ).toBeInTheDocument();
    });

    it('should not give US users the choice to opt out', async () => {
        GeoLocationService.isUSUser.mockReturnValue(true);
        renderForSWR(
            <RegistrationForm
                onForgotPasswordClick={noop}
                onSuccess={noop}
                hasFocus={false}
            />
        );

        expect(await screen.findByText(/^by registering/i)).toBeInTheDocument();
    });
});
