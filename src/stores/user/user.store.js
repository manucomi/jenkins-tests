import create from 'zustand';

const getHighestSubTier = (subscriptions, index) => {
    let highestRank = null;
    const tierRank = {
        1: ['BST', 'BSM', 'BSTL'],
        2: ['BTR', 'BTM', 'BTRL'],
        3: ['BGD', 'BGM', 'BGDL'],
    };

    if (index <= Object.entries(tierRank).length) {
        subscriptions.some((sub) => {
            const accessLevel = sub.subscriptionAccessLevel;
            if (tierRank[index].includes(accessLevel)) {
                highestRank = sub.subscriptionAccessLevel;
                return true;
            }
            return false;
        });

        if (highestRank === null) {
            const increment = index + 1;
            return getHighestSubTier(subscriptions, increment);
        }
    } else {
        highestRank = 'BST';
    }

    return highestRank;
};

const calculateSubcriberType = (profile) => {
    const roles = profile.tiers;
    if (roles && roles.length > 0) {
        switch (roles[0]?.roleCode) {
            case 'ROLE_HBRG_GOOD':
                return 'Digital Subscriber';
            case 'ROLE_HBRG_BETTER':
                return 'Digital + Print Subscriber';
            case 'ROLE_HBRG_BEST':
                return 'Premium Subscriber';
            case 'ROLE_HBRG_ALLACCESS':
                return 'All Access Subscriber';
            case 'ROLE_HBRG_GOOD_LEARNING':
                return 'Digital + Learning Subscriber';
            case 'ROLE_HBRG_BETTER_LEARNING':
                return 'Digital & Print + Learning Subscriber';
            case 'ROLE_HBRG_BEST_LEARNING':
                return 'Premium + Learning Subscriber';
            default:
                return null;
        }
    }
    return null;
};

const checkHmmEligibility = (subscriber) => {
    const isHmmTestGroupUser = subscriber?.subscriberPremiums?.some(
        ({ premiumCode }) => premiumCode === 'HMMTESTGROUP'
    );
    const hasLearningSubscription = ['BSTL', 'BTRL', 'BGDL'].includes(
        subscriber?.subscriptionAccessLevel
    );
    return isHmmTestGroupUser || hasLearningSubscription;
};

const determineSubscriptionParams = (userProfile) => {
    if (userProfile?.subscriber) {
        const { subscriber } = userProfile;
        subscriber.subscriberTypeCaption = calculateSubcriberType(userProfile);
        subscriber.subscriptionAdTier = getHighestSubTier(
            subscriber.subscriptions,
            1
        );
        subscriber.isHmmEligible = checkHmmEligibility(subscriber);
    }
    return userProfile;
};
const useUserStore = create((set) => ({
    profile: null,
    setProfile: (userProfile) => {
        set(() => ({
            profile: determineSubscriptionParams(userProfile),
        }));
    },
    deleteProfile: () => set(() => ({ profile: null })),
}));

export default useUserStore;
