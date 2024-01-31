import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import Hero from '../Hero';

export default {
    title: 'components/Hero',
    component: Hero,
};

function Template(args) {
    const { article } = args;
    useArticleStore.getState().setArticle(article);
    return (
        <div style={{ width: '500px' }}>
            <Hero />
        </div>
    );
}

export const Standard = {
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
