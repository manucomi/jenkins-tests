import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthorBio from './AuthorBio';

describe('AuthorBio', () => {
    test("should display the author's image if present", () => {
        const mockAuthor = {
            name: 'Mock Author',
            image: '/resources/images/author-url.jpg',
            bio: 'Mock Author is a Harvard Professor',
        };

        render(<AuthorBio author={mockAuthor} />);
        const authorImage = screen.getByRole('img');
        expect(authorImage).toBeInTheDocument();
    });

    test("should display the author's initials when an image is not present", () => {
        const mockAuthor = {
            name: 'Mock Author',
            image: '',
            bio: 'Mock Author is a Harvard Professor',
        };
        render(<AuthorBio author={mockAuthor} />);

        expect(screen.getByText('MA')).toBeInTheDocument();
    });

    test('should only display two letters even if author has several names', () => {
        const mockArticle = {
            name: 'Jon Carl Smith',
            image: '',
            bio: 'Jon Carl Smith is a Harvard Professor',
        };

        render(<AuthorBio author={mockArticle} />);
        expect(screen.getByText('JS')).toBeInTheDocument();
    });
});
