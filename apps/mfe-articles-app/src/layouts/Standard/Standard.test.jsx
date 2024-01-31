import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import Standard from './Standard';

describe('<Standard />', () => {
    it('renders the title text', () => {
        const standardArticle = MockArticle[2];

        useArticleStore
            .getState()
            .setArticle({ ...standardArticle, content: 'some text' });
        render(<Standard />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: standardArticle.title,
            }),
        ).toBeInTheDocument();
    });
});
