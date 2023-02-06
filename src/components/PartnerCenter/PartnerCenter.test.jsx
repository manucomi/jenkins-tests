import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PartnerCenter from './PartnerCenter';

jest.mock('Hooks/useAdConsent/useAdConsent', () => {
    return {
        __esModule: true,
        default: () => true,
    };
});

describe('<PartnerCenter /> component', () => {
    it('should load 4 ads', async () => {
        const { queryAllByTestId } = render(<PartnerCenter />);

        await waitFor(() => {
            expect(queryAllByTestId('ad')).toHaveLength(4);
        });
    });
});
