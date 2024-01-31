import useArticleStore from 'stores/article/article.store';
import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import RecommendedForYou from './RecommendedForYou';

describe('<RecommendedForYou />', () => {
    it('should render the correct quantity of recommended articles', async () => {
        const mockArticle = { ...MockArticle[0] };
        useArticleStore.getState().setArticle(mockArticle);

        render(<RecommendedForYou />);

        const recommendedArticles = screen.getAllByRole('link');
        expect(recommendedArticles.length).toBe(
            mockArticle.recommendations.articles.length,
        );
    });
});
