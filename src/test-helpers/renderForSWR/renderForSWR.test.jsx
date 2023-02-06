import React from 'react';
import { screen } from '@testing-library/react';
import renderForSWR from './renderForSWR';
import '@testing-library/jest-dom/extend-expect';

describe('renderForSWR test helper', () => {
    it('should render children', () => {
        renderForSWR(<button type="button">Click Me!</button>);
        expect(screen.queryByRole('button')).toBeInTheDocument();
    });
});
