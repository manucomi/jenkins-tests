import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Loader, { LoaderTestIds } from './Loader';

describe('<Loader /> component', () => {
    it('should include custom classes', () => {
        const classes = 'centered';
        render(<Loader className={classes} />);
        expect(screen.queryByTestId(LoaderTestIds.CONTAINER)).toHaveClass(
            classes
        );
    });
});
