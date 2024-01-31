import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import BigIdeaHeadline from '../BigIdeaHeadline';

function Template() {
    const bigIdeaArticle = MockArticle[0];

    useArticleStore.getState().setArticle(bigIdeaArticle);
    return <BigIdeaHeadline />;
}

export default {
    title: 'Components/BigIdeaHeadline',
    component: BigIdeaHeadline,
};

export const Default = {
    render: Template.bind({}),
};
