import useArticleStore from '../../stores/article/article.store';

const useArticle = () => {
    const article = useArticleStore((state) => state.article);
    const setArticle = useArticleStore((state) => state.setArticle);
    return { article, setArticle };
};

export default useArticle;
