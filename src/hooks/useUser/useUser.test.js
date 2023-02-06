import { renderHook, act } from '@testing-library/react';
import useUserStore from 'Stores/user/user.store';
import useUser from './useUser';

const userProfile = {
    id: 11,
    firstName: 'Jerry',
    lastName: 'Garcia',
    subscriber: {
        subscriptions: [
            {
                accountNumber: '001000422221',
                active: true,
                country: 'United Kingdom',
                firstPurchaseDate: 1599563081000,
                issuesRemaining: null,
                lastIssueServed: 1631159999000,
                lastModifiedDate: 1624840292882,
                mostRecentPurchaseDate: 1599563081000,
                numberOfIssues: null,
                orderValue: 120,
                subscriptionAccessLevel: 'BGD',
                subscriptionAccessLevelDescription: 'Digital & Print',
                subscriptionAccessPeriod: {
                    startDate: 1599563080000,
                    expirationDate: 1631159999000,
                },
                subscriptionCode: 'PIANO',
                subscriptionSourceCode: 'PIANO',
                subscriptionStatus: 'ACTIVE',
                termTitle: 'Annual | Digital & Print | Standard | GBP',
                timesRenewed: 0,
            },
            {
                accountNumber: '001000422221',
                active: true,
                country: 'United Kingdom',
                firstPurchaseDate: 1599563081000,
                issuesRemaining: null,
                lastIssueServed: 1631159999000,
                lastModifiedDate: 1624840292882,
                mostRecentPurchaseDate: 1599563081000,
                numberOfIssues: null,
                orderValue: 120,
                subscriptionAccessLevel: 'BTM',
                subscriptionAccessLevelDescription: 'Digital & Print',
                subscriptionAccessPeriod: {
                    startDate: 1599563080000,
                    expirationDate: 1631159999000,
                },
                subscriptionCode: 'PIANO',
                subscriptionSourceCode: 'PIANO',
                subscriptionStatus: 'ACTIVE',
                termTitle: 'Annual | Digital & Print | Standard | GBP',
                timesRenewed: 0,
            },
        ],
    },
};

describe('useUser', () => {
    it('should set the profile', () => {
        const { result } = renderHook(() => useUser());
        expect(useUserStore.getState().profile).toBeNull();
        act(() => result.current.setProfile(userProfile));
        expect(useUserStore.getState().profile).toBe(userProfile);
    });

    it('should delete the profile', () => {
        const { result } = renderHook(() => useUser());
        act(() => result.current.setProfile(userProfile));
        expect(useUserStore.getState().profile).toBe(userProfile);
        act(() => result.current.deleteProfile());
        expect(useUserStore.getState().profile).toBeNull();
    });
});
