import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import MainTopicLink from './MainTopicLink';

describe('MainTopicLink', () => {
    test('it renders BigIdea topic link', () => {
        const bigIdeaArticle = MockArticle[0];
        useArticleStore.getState().setArticle(bigIdeaArticle);

        render(<MainTopicLink />);

        expect(
            screen.getByRole('link', {
                name: bigIdeaArticle.topics[0],
            }),
        ).toBeInTheDocument();
    });

    test('it renders Spotlight topic link', () => {
        const spotlightArticle = MockArticle[1];
        useArticleStore.getState().setArticle(spotlightArticle);

        render(<MainTopicLink />);
        expect(
            screen.getByRole('link', {
                name: spotlightArticle.topics[0],
            }),
        ).toBeInTheDocument();
    });

    test('it renders Standard article topic link', () => {
        const standardArticle = MockArticle[2];
        useArticleStore.getState().setArticle(standardArticle);

        render(<MainTopicLink />);
        expect(
            screen.getByRole('link', {
                name: standardArticle.topics[0],
            }),
        ).toBeInTheDocument();
    });
});
