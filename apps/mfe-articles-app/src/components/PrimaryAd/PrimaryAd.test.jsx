import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryAd, { PrimaryAdTestIds } from './PrimaryAd';

describe('<PrimaryAd />', () => {
    it('should render an ad', () => {
        render(<PrimaryAd />);

        expect(
            screen.getByTestId(PrimaryAdTestIds.CONTAINER),
        ).not.toBeEmptyDOMElement();
    });
});
