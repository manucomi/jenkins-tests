import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import BigIdea from './BigIdea';

describe('<BigIdea />', () => {
    it('renders the title text', () => {
        const bigIdeaArticle = MockArticle[0];

        useArticleStore
            .getState()
            .setArticle({ ...bigIdeaArticle, content: 'Some text' });

        render(<BigIdea />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: bigIdeaArticle.series.title,
            }),
        ).toBeInTheDocument();
    });
});
