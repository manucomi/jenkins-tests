import React from 'react';
import { render, screen } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';
import { MockArticle } from 'mfe-articles-shared';
import StandardHeadline from './StandardHeadline';

describe('StandardHeadline', () => {
    test('headline is visible', () => {
        const standardArticle = MockArticle[2];

        useArticleStore.getState().setArticle(standardArticle);

        render(<StandardHeadline isVisible />);

        const headlineContainer = screen
            .getByText(standardArticle.title)
            .closest('div');

        expect(headlineContainer).toHaveClass('visible');
        expect(screen.getByText(standardArticle.topics[0])).toBeInTheDocument();
        expect(screen.getByText(standardArticle.title)).toBeInTheDocument();
    });

    test('headline is not visible', () => {
        const standardArticle = MockArticle[2];

        useArticleStore.getState().setArticle(standardArticle);

        render(<StandardHeadline isVisible={false} />);

        const headlineContainer = screen
            .getByText(standardArticle.title)
            .closest('div');

        expect(headlineContainer).not.toHaveClass('visible');
    });
});
