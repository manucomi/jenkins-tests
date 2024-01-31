import MockAd from '__mocks__/MockAd/MockAd';
import PrimaryAd from '../PrimaryAd';

export default {
    title: 'Components/PrimaryAd',
    component: PrimaryAd,
};

export const Default = {
    parameters: {
        custom: {
            mocks: {
                AdSlot: {
                    impl: <MockAd />,
                },
            },
        },
    },
};
