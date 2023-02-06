import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useUserStore from 'Stores/user/user.store';
import NavBar from './NavBar';

const hmmTestGroupUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BST',
        subscriberPremiums: [
            {
                premiumCode: 'HMMTESTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const learningSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BSTL',
        subscriberPremiums: [
            {
                premiumCode: 'DEFAULTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const nonLearningSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [],
        subscriptionAccessLevel: 'BST',
        subscriberPremiums: [
            {
                premiumCode: 'DEFAULTGROUP',
            },
        ],
    },

    tiers: [{ roleCode: 'ROLE_HBRG_GOOD' }],
};

const nonSubscriberUserProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
};

describe('<NavBar /> component', () => {
    it('should include custom classes', () => {
        const classes = 'cotton candy';
        const { rerender } = render(<NavBar />);
        expect(screen.getByRole('navigation')).not.toHaveClass(classes);
        rerender(<NavBar className={classes} />);
        expect(screen.getByRole('navigation')).toHaveClass(classes);
    });

    it('should hide the HMM link for non subscribers', () => {
        render(<NavBar />);
        act(() => {
            useUserStore.getState().setProfile(nonSubscriberUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).not.toBeInTheDocument();
    });

    it('should hide the HMM link for non-learning subscribers', () => {
        render(<NavBar />);
        act(() => {
            useUserStore
                .getState()
                .setProfile(nonLearningSubscriberUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).not.toBeInTheDocument();
    });

    it('should display the HMM link for HMM test group users', () => {
        render(<NavBar />);
        act(() => {
            useUserStore.getState().setProfile(hmmTestGroupUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).toBeInTheDocument();
    });

    it('should display the HMM link for learning subscribers', () => {
        render(<NavBar />);
        act(() => {
            useUserStore.getState().setProfile(learningSubscriberUserProfile);
        });
        expect(screen.queryByText(/HBR Learning/)).toBeInTheDocument();
    });
});
