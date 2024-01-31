import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import MainTopicLink from '../MainTopicLink';

export default {
    title: 'Components/MainTopicLink',
    component: MainTopicLink,
    argTypes: {
        article: {
            table: {
                disable: true,
            },
        },
    },
};

function Template(args) {
    const { article } = args;
    useArticleStore.getState().setArticle(article);
    return <MainTopicLink />;
}

export const Default = {
    render: Template.bind({}),
    args: {
        article: MockArticle[2],
    },
};

export const BigIdea = {
    render: Template.bind({}),
    args: {
        article: MockArticle[0],
    },
};

export const Spotlight = {
    render: Template.bind({}),
    args: {
        article: MockArticle[1],
    },
};

export const Premium = {
    render: Template.bind({}),
    args: {
        article: MockArticle[3],
    },
};
