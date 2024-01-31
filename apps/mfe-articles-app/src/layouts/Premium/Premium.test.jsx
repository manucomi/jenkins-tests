import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import Premium from './Premium';

describe('<Premium />', () => {
    it('renders the title text', () => {
        const premiumArticle = MockArticle[3];

        useArticleStore
            .getState()
            .setArticle({ ...premiumArticle, content: 'some text' });
        render(<Premium />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: premiumArticle.title,
            }),
        ).toBeInTheDocument();
    });
});
