import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import PublicationDate from './PublicationDate';

describe('PublicationDate', () => {
    it('renders TOP position with magazine issue data', () => {
        const spotlightArticle = MockArticle[1];
        useArticleStore.getState().setArticle(spotlightArticle);

        render(<PublicationDate />);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders BOTTOM position with magazine date', () => {
        const spotlightArticle = MockArticle[1];
        useArticleStore.getState().setArticle(spotlightArticle);

        render(<PublicationDate position={PublicationDate.variants.BOTTOM} />);
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders TOP position without magazine issue data', () => {
        const standardArticle = MockArticle[2];
        useArticleStore.getState().setArticle(standardArticle);

        render(<PublicationDate />);
        expect(screen.getByText(/March 16, 2020/)).toBeInTheDocument();
    });
});
