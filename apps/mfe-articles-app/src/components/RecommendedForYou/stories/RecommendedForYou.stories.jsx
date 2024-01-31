import useArticleStore from 'stores/article/article.store';
import { MockArticle } from 'mfe-articles-shared';
import RecommendedForYou from '../RecommendedForYou';

function Template() {
    const setArticle = useArticleStore((state) => state.setArticle);
    setArticle({ ...MockArticle[0] });

    return <RecommendedForYou />;
}

export default {
    title: 'Components/RecommendedForYou',
    component: RecommendedForYou,
};

export const Default = {
    render: Template.bind({}),
    name: 'RecommendedForYou',
    parameters: {
        docs: {
            source: {
                type: 'dynamic',
            },
        },
    },
};
