import BigIdea from 'layouts/BigIdea/BigIdea';
import Spotlight from 'layouts/Spotlight/Spotlight';
import Standard from 'layouts/Standard/Standard';
import Premium from 'layouts/Premium/Premium';
import useArticleStore from 'stores/article/article.store';

function LayoutResolver() {
    const article = useArticleStore((state) => state.article);
    if (article.type === 'big idea') {
        return <BigIdea />;
    }
    if (article.type === 'spotlight') {
        return <Spotlight />;
    }
    if (article.type === 'premium') {
        return <Premium />;
    }

    return <Standard />;
}

export default LayoutResolver;
