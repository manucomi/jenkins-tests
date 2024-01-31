import React from 'react';
import { render, screen } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';
import { MockArticle } from 'mfe-articles-shared';
import SpotlightHeadline from './SpotlightHeadline';

describe('SpotlightHeadline', () => {
    test('it renders Spotlight headline', () => {
        const spotlightArticle = MockArticle[1];

        useArticleStore.getState().setArticle(spotlightArticle);

        render(<SpotlightHeadline isVisible />);

        expect(screen.getByText('Spotlight Series')).toBeInTheDocument();
        expect(
            screen.getByText(spotlightArticle.series.title),
        ).toBeInTheDocument();
    });
});
