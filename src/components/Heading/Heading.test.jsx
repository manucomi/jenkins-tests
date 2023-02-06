import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Heading from './Heading';
import styles from './Heading.module.scss';

describe('<Heading /> component', () => {
    it('should render the correct heading level', () => {
        render(<Heading level={1}>A Heading</Heading>);
        expect(screen.getByRole('heading')).toHaveClass(styles['level-1']);
    });
});
