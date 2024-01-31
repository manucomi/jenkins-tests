import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import PremiumHeadline, { PremiumHeadlineTestIds } from './PremiumHeadline';

describe('PremiumHeadline', () => {
    test('headline is visible', () => {
        const premiumArticle = MockArticle[3];

        useArticleStore.getState().setArticle(premiumArticle);

        render(<PremiumHeadline isVisible />);

        const headlineContainer = screen.getByTestId(
            PremiumHeadlineTestIds.CONTAINER,
        );

        expect(headlineContainer).toHaveClass('visible');
        expect(screen.getByText(premiumArticle.topics[0])).toBeInTheDocument();
        expect(screen.getByText(premiumArticle.title)).toBeInTheDocument();
    });

    test('headline is not visible', () => {
        const premiumArticle = MockArticle[3];

        useArticleStore.getState().setArticle(premiumArticle);

        render(<PremiumHeadline isVisible={false} />);

        const headlineContainer = screen.getByTestId(
            PremiumHeadlineTestIds.CONTAINER,
        );

        expect(headlineContainer).not.toHaveClass('visible');
    });
});
