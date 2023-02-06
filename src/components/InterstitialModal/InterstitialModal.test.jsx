import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import * as cookieCutter from 'cookie-cutter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import useAdConsent from 'Hooks/useAdConsent/useAdConsent';
import InterstitialModal from './InterstitialModal';
import styles from './InterstitialModal.module.scss';

let mockAdRender = [];

jest.mock('focus-trap-react');
jest.mock('Hooks/useAdConsent/useAdConsent');
jest.mock('cookie-cutter', () => {
    return {
        get: jest.fn(),
        set: jest.fn(),
    };
});
jest.mock('../AdSlot/AdSlot', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function adSlotMock({ path, onSlotRender }) {
            mockAdRender[path] = onSlotRender;
            return <div />;
        },
    };
});

beforeEach(() => {
    jest.useFakeTimers();
    useAdConsent.mockReturnValue(true);
    cookieCutter.get.mockReturnValue(undefined);
    mockAdRender = [];

    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
        ancestorOrigins: null,
        hash: null,
        host: 'localhost',
        port: '80',
        protocol: 'http:',
        hostname: 'localhost',
        href: 'http://localhost/',
        origin: 'http://localhost/',
        pathname: null,
        search: null,
        assign: null,
        reload: null,
        replace: null,
    };
});

afterEach(() => {
    act(() => {
        jest.runAllTimers();
    });
    jest.useRealTimers();
    jest.resetAllMocks();
});

function setupRender(Component) {
    return {
        user: userEvent.setup({ delay: null }),
        ...render(Component),
    };
}

describe('<InterstitialModal /> component', () => {
    it('should not render the modal if consent is not given', () => {
        useAdConsent.mockReturnValueOnce(false);

        render(<InterstitialModal />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should not render the modal if `hideIntromercial` param exists', () => {
        window.location.href = 'http://localhost/?hideIntromercial=true';

        render(<InterstitialModal />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should not render the modal if `marketing_interruption` cookie is defined', () => {
        cookieCutter.get.mockReturnValueOnce(true);

        render(<InterstitialModal />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should close the modal', async () => {
        const { user } = setupRender(<InterstitialModal />);
        expect(screen.queryByRole('dialog')).toBeInTheDocument();

        await user.click(screen.getByLabelText('Close the advertisement'));
        await waitFor(
            () => {
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            },
            { timeout: 500 }
        );
    });

    it('should automatically close the modal', async () => {
        render(<InterstitialModal />);
        expect(screen.queryByRole('dialog')).toBeInTheDocument();

        act(() => {
            jest.runAllTimers();
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should only display the modal if an ad is filled', () => {
        const { rerender } = render(<InterstitialModal />);
        expect(screen.getByRole('dialog')).toHaveClass(styles['is-hidden']);
        act(() => {
            mockAdRender['/34363400/HBR_640x480_WelcomeAd']({ isEmpty: false });
        });
        rerender(<InterstitialModal />);
        expect(screen.getByRole('dialog')).not.toHaveClass(styles['is-hidden']);

        act(() => {
            mockAdRender['/34363400/HBR_300x250_WelcomeAd']({ isEmpty: false });
        });
        rerender(<InterstitialModal />);
        expect(screen.getByRole('dialog')).not.toHaveClass(styles['is-hidden']);
    });
});
