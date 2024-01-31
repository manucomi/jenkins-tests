import useArticleStore from './article.store';

describe('article store', () => {
    test('should set the article title property', () => {
        expect(useArticleStore.getState().article).toStrictEqual({});

        const newArticleState = { title: 'test' };
        useArticleStore.getState().setArticle(newArticleState);

        expect(useArticleStore.getState().article).toStrictEqual(
            newArticleState,
        );
    });
});
