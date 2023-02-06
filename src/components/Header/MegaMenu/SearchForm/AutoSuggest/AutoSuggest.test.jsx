import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchService from 'Services/SearchService/SearchService';
import renderForSWR from '../../../../../test-helpers/renderForSWR/renderForSWR';
import AutoSuggest from './AutoSuggest';

jest.mock('Services/SearchService/SearchService');

let mockRecords;
let mockSubjects;

beforeEach(() => {
    mockRecords = [
        {
            contentType: 'Book',
            title: 'Title',
            link: 'https://url.com',
        },
        {
            contentType: 'Digital',
            title: 'Title',
            link: 'https://otherurl.com',
        },
    ];

    mockSubjects = [
        {
            title: 'Leadership',
            link: '?nf3q435',
        },
    ];

    SearchService.getSuggestions.mockResolvedValue({
        records: mockRecords,
        subjects: mockSubjects,
    });
});

describe('<AutoSuggest /> component', () => {
    it('should generate lists when the term is longer than 2 characters', async () => {
        const { rerender } = renderForSWR(<AutoSuggest searchTerm="tes" />);
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem').length).toBe(
                mockRecords.length + mockSubjects.length
            );
        });

        rerender(<AutoSuggest searchTerm="leadership" />);
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem').length).toBe(
                mockRecords.length + mockSubjects.length
            );
        });
    });

    it('should not generate lists when the term is less than 3 characters', async () => {
        renderForSWR(<AutoSuggest searchTerm="te" />);
        await waitFor(() => {
            expect(screen.queryAllByRole('list').length).toBe(0);
        });
    });

    it('should not generate lists when there are no suggestions', async () => {
        mockRecords = [];
        mockSubjects = [];
        SearchService.getSuggestions.mockResolvedValue({
            records: [],
            subjects: [],
        });

        await act(async () => renderForSWR(<AutoSuggest searchTerm="test" />));
        await waitFor(() => {
            expect(screen.queryAllByRole('list').length).toBe(0);
        });
    });
});
