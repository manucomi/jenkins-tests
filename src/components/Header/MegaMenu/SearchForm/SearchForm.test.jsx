import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import SearchForm from './SearchForm';
import styles from './SearchForm.module.scss';

let mockAutoSuggestTerm = null;

jest.mock('./AutoSuggest/AutoSuggest', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line react/prop-types
        default: function autoSuggestMock({ searchTerm }) {
            mockAutoSuggestTerm = searchTerm;
            return <div />;
        },
    };
});

afterEach(() => {
    jest.clearAllMocks();
    mockAutoSuggestTerm = null;
});

describe('<SearchForm /> component', () => {
    it('should show the clear button', async () => {
        render(<SearchForm />);
        const [clearBtn] = screen.getAllByRole('button');
        expect(clearBtn).toHaveClass(styles.hide);

        await userEvent.type(screen.getByRole('searchbox'), 'test');
        expect(clearBtn).not.toHaveClass(styles.hide);
    });

    it('should clear the search field', async () => {
        const mockRef = { current: { focus: () => {} } };
        render(<SearchForm ref={mockRef} />);
        const searchBox = screen.getByRole('searchbox');
        const mockText = 'test';

        await userEvent.type(searchBox, mockText);
        expect(searchBox).toHaveValue(mockText);

        await userEvent.click(screen.getByRole('button', { name: /^clear$/i }));
        expect(searchBox).toHaveValue('');
        expect(searchBox).toHaveFocus();
    });

    it('should periodically update the auto suggest term', async () => {
        const searchTerm = 'test';
        render(<SearchForm />);

        await userEvent.type(screen.getByRole('searchbox'), searchTerm);
        expect(mockAutoSuggestTerm).not.toEqual(searchTerm);
        await waitFor(() => {
            expect(mockAutoSuggestTerm).toEqual(searchTerm);
        });
    });
});
