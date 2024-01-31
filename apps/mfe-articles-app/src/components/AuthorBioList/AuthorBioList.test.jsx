import React from 'react';
import { render, screen } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';
import AuthorBioList from './AuthorBioList';

describe('AuthorBioList', () => {
    test("should render the correct quantity of authors' bios", () => {
        const mockArticle = {
            authors: [
                {
                    name: 'Mock Author 1',
                    image: '/resources/images/author-url.jpg',
                    bio: 'Mock Author 1 is a Harvard Professor',
                },
                {
                    name: 'Mock Author 2',
                    image: '',
                    bio: 'Mock Author 2 is a Harvard Professor',
                },
            ],
        };
        useArticleStore.getState().setArticle({ ...mockArticle });

        render(<AuthorBioList />);

        const authorBios = screen.getAllByText(/Mock Author/i);
        expect(authorBios.length).toBe(mockArticle.authors.length);
    });
});
