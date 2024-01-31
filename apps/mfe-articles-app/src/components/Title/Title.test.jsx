import { render, screen } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';
import Title from './Title';

describe('<Title />', () => {
    it('renders the standard title', () => {
        const mockArticle = { title: 'Standard Title', type: 'standard' };
        useArticleStore.getState().setArticle(mockArticle);

        render(<Title />);

        const headline = screen.getByRole('heading', { level: 1 });

        expect(headline).toBeInTheDocument();
        expect(headline).toHaveClass('standard');
    });
    it('renders the big idea title', () => {
        const mockArticle = { title: 'Big Idea Title', type: 'big idea' };
        useArticleStore.getState().setArticle(mockArticle);

        render(<Title />);

        const headline = screen.getByRole('heading', { level: 1 });

        expect(headline).toBeInTheDocument();
        expect(headline).toHaveClass('big-idea');
    });
    it('renders the spotlight title', () => {
        const mockArticle = { title: 'Spotlight Title', type: 'spotlight' };
        useArticleStore.getState().setArticle(mockArticle);

        render(<Title />);

        const headline = screen.getByRole('heading', { level: 1 });

        expect(headline).toBeInTheDocument();
        expect(headline).toHaveClass('spotlight');
    });
});
