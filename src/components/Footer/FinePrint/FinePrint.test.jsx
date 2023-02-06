import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FinePrint from './FinePrint';

describe('<FinePrint /> component', () => {
    it('should render', () => {
        render(<FinePrint />);
        expect(
            screen.queryByTestId(FinePrint.testIds.CONTAINER)
        ).toBeInTheDocument();
    });
});
