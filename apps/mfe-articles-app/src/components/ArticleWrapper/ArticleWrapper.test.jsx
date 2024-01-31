import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleWrapper from './ArticleWrapper';

describe('ArticleWrapper', () => {
    test('it renders an article element', () => {
        render(
            <ArticleWrapper>
                <div>Mock Article</div>
            </ArticleWrapper>,
        );
        expect(screen.getByRole('article')).toBeInTheDocument();
    });
});
