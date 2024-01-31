import useArticleStore from 'stores/article/article.store';
import MockAd from '__mocks__/MockAd/MockAd';
import { MockArticle } from 'mfe-articles-shared';
import LayoutResolver from '../LayoutResolver';

export default {
    title: 'Components/LayoutResolver',
    component: LayoutResolver,
};

function Template(args) {
    const { article } = args;
    useArticleStore.getState().setArticle(article);
    return <LayoutResolver />;
}

export const BigIdeaLayout = {
    render: Template.bind({}),
    args: {
        article: MockArticle[0],
    },
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

export const SpotlightLayout = {
    render: Template.bind({}),
    args: {
        article: MockArticle[1],
    },
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

export const StandardLayout = {
    render: Template.bind({}),
    args: {
        article: MockArticle[2],
    },
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

export const PremiumLayout = {
    render: Template.bind({}),
    args: {
        article: MockArticle[3],
    },
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
