import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import PublicationDate from '../PublicationDate';

export default {
    title: 'Components/PublicationDate',
    component: PublicationDate,
    argTypes: {
        article: {
            table: {
                disable: true,
            },
        },
    },
};

function Template(args) {
    const { article, position } = args;
    useArticleStore.getState().setArticle(article);
    return <PublicationDate position={position} />;
}

export const Default = {
    render: Template.bind({}),
    args: {
        article: MockArticle[1],
    },
};

export const Bottom = {
    render: Template.bind({}),
    args: {
        article: MockArticle[1],
        position: 'bottom',
    },
};
