import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ShareModal from './ShareModal';

const shareCallbacks = {
    shareOnLinkedin: jest.fn(),
    shareOnTwitter: jest
        .fn()
        .mockImplementation(() => 'https://hbr.org/mock/title'),
    shareOnFacebook: jest.fn(),
};

const params = {
    onClose: jest.fn,
    shareData: {
        title: 'Mock Title',
        type: 'Digital Article',
        url: 'https://hbr.org1/mock-title',
    },
};
describe('<ShareModal /> component', () => {
    it('should render a dialog', () => {
        render(
            <ShareModal
                onClose={params.onClose}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    it('should execute the onClose function', async () => {
        const closeFn = jest.fn();
        render(
            <ShareModal
                onClose={closeFn}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        await userEvent.click(screen.getAllByRole('button')[0]);

        expect(closeFn).toBeCalled();
    });
    it('should set the selected view', async () => {
        render(
            <ShareModal
                onClose={params.onClose}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        await userEvent.click(screen.getByRole('tab', { name: 'LinkedIn' }));
        expect(
            screen.queryByRole('button', { name: /Share On LinkedIn/i })
        ).toBeInTheDocument();
        await userEvent.click(screen.getByRole('tab', { name: 'Twitter' }));
        expect(screen.getAllByText('Share On Twitter')[0]).toBeInTheDocument();
    });
    it('should share on twitter', async () => {
        render(
            <ShareModal
                onClose={params.onClose}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        await userEvent.click(screen.getByRole('tab', { name: 'Twitter' }));

        await userEvent.click(screen.getAllByText('Share On Twitter')[0]);
        expect(shareCallbacks.shareOnTwitter).toBeCalled();
    });

    it('should share on linkedIn', async () => {
        render(
            <ShareModal
                onClose={params.onClose}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        await userEvent.click(screen.getByRole('tab', { name: 'LinkedIn' }));

        await userEvent.click(screen.getAllByText('Share On LinkedIn')[0]);
        expect(shareCallbacks.shareOnLinkedin).toBeCalled();
    });

    it('should share on Facebook', async () => {
        render(
            <ShareModal
                onClose={params.onClose}
                shareData={params.shareData}
                shareOnFacebook={shareCallbacks.shareOnFacebook}
                shareOnTwitter={shareCallbacks.shareOnTwitter}
                shareOnLinkedin={shareCallbacks.shareOnLinkedin}
            />
        );
        await userEvent.click(screen.getByRole('tab', { name: 'Facebook' }));

        await userEvent.click(screen.getAllByText('Share On Facebook')[0]);
        expect(shareCallbacks.shareOnFacebook).toBeCalled();
    });
});
