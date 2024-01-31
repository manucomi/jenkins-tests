import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import BigIdeaHeadline from './BigIdeaHeadline';

describe('BigIdeaHeadline', () => {
    test('it renders Big Idea headline', () => {
        const bigIdeaArticle = MockArticle[0];

        useArticleStore.getState().setArticle(bigIdeaArticle);

        render(<BigIdeaHeadline />);

        expect(screen.getByText('The Big Idea Series')).toBeInTheDocument();
        expect(
            screen.getByText(bigIdeaArticle.series.title),
        ).toBeInTheDocument();
    });
});
