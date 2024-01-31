import { render, screen, act } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';
import Hero from './Hero';

describe('<Hero /> component', () => {
    const mockData = {
        type: 'standard',
        hero: {
            image: {
                defaultSrc: '/resources/test/image',
                sizes: '(min-width: 64em) 84vw, 100vw',
                srcset: '/resoures/test/image 300w /resoures/test/image 768w',
            },
            credits: 'Test Author',
        },
    };

    test('should render a proper image', () => {
        useArticleStore.getState().setArticle({ ...mockData });
        render(<Hero />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    test('should display credits for different types of articles', () => {
        useArticleStore.getState().setArticle({ ...mockData });
        const { rerender } = render(<Hero />);

        expect(screen.getByText(mockData.hero.credits)).toBeInTheDocument();

        act(() =>
            useArticleStore
                .getState()
                .setArticle({ ...mockData, type: 'big idea' }),
        );
        rerender(<Hero />);
        expect(screen.getByText(mockData.hero.credits)).toHaveClass('big-idea');

        act(() =>
            useArticleStore
                .getState()
                .setArticle({ ...mockData, type: 'spotlight' }),
        );
        rerender(<Hero />);
        expect(screen.getByText(mockData.hero.credits)).toHaveClass(
            'spotlight',
        );
    });
});
