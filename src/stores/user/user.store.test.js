import useUserStore from './user.store';

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

describe('user store', () => {
    it('should set the profile property', () => {
        expect(useUserStore.getState().profile).toBeNull();
        useUserStore.getState().setProfile(userProfile);
        expect(useUserStore.getState().profile).toBe(userProfile);
    });

    it('should set the profile property to `null`', () => {
        useUserStore.getState().setProfile(userProfile);
        expect(useUserStore.getState().profile).toBe(userProfile);
        useUserStore.getState().deleteProfile();
        expect(useUserStore.getState().profile).toBeNull();
    });

    it('should return 1 subscription with access level of "Good"', () => {
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriptionAdTier
        ).toBe('BTM');
    });

    it('should return "Best" access level if subscriptionAccessLevel is not a recognized tier (BST, BSM, BTR, BTM, BGD, BGM)', () => {
        userProfile.subscriber.subscriptions = [
            {
                subscriptionAccessLevel: 'NON',
            },
        ];

        useUserStore.getState().setProfile(userProfile);

        expect(
            useUserStore.getState().profile.subscriber.subscriptionAdTier
        ).toBe('BST');
    });

    it('should return "Best" access level if subscriptionAccessLevel is not a recognized tier (BST, BSM, BTR, BTM, BGD, BGM)', () => {
        userProfile.subscriber.subscriptions = [
            {
                subscriptionAccessLevel: 'NON',
            },
        ];

        useUserStore.getState().setProfile(userProfile);

        expect(
            useUserStore.getState().profile.subscriber.subscriptionAdTier
        ).toBe('BST');
    });
    it('should set the Subscription access property', () => {
        userProfile.tiers = [{ roleCode: 'ROLE_HBRG_GOOD' }];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriberTypeCaption
        ).toBe('Digital Subscriber');

        userProfile.tiers = [{ roleCode: 'ROLE_HBRG_BETTER' }];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriberTypeCaption
        ).toBe('Digital + Print Subscriber');

        userProfile.tiers = [{ roleCode: 'ROLE_HBRG_BEST' }];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriberTypeCaption
        ).toBe('Premium Subscriber');

        userProfile.tiers = [{ roleCode: 'ROLE_HBRG_ALLACCESS' }];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriberTypeCaption
        ).toBe('All Access Subscriber');

        userProfile.tiers = [{ roleCode: 'ROLE' }];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.subscriberTypeCaption
        ).toBeNull();
    });

    it('should set the isHmmEligible property to true for learning subscribers', () => {
        userProfile.subscriber.subscriptionAccessLevel = 'BSTL';
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeTruthy();

        userProfile.subscriber.subscriptionAccessLevel = 'BTRL';
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeTruthy();

        userProfile.subscriber.subscriptionAccessLevel = 'BGDL';
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeTruthy();
    });

    it('should set the isHmmEligible property to false for non learning subscribers', () => {
        userProfile.subscriber.subscriptionAccessLevel = 'BST';
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeFalsy();

        userProfile.subscriber.subscriptionAccessLevel = 'NON';
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeFalsy();
    });

    it('should set the isHmmEligible property to true for HMM test group users', () => {
        userProfile.subscriber.subscriberPremiums = [
            {
                premiumCode: 'HMMTESTGROUP',
            },
        ];
        useUserStore.getState().setProfile(userProfile);
        expect(
            useUserStore.getState().profile.subscriber.isHmmEligible
        ).toBeTruthy();
    });

    it('should set the isHmmEligible property to false for non subscribers', () => {
        const nonSubscriberUserProfile = {
            id: 345,
            firstName: 'Jerry',
            lastName: 'Garcia',
        };
        useUserStore.getState().setProfile(nonSubscriberUserProfile);
        expect(
            useUserStore.getState().profile?.subscriber?.isHmmEligible
        ).toBeFalsy();
    });
});
