import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from './Button';
import styles from './Button.module.scss';

describe('<Button /> component', () => {
    it('should render a text variant', () => {
        render(
            <Button variant={Button.variants.TEXT}>I am a text button</Button>
        );
        expect(screen.getByRole('button')).toHaveClass(styles.text);
    });

    it('should render children', () => {
        render(
            <Button variant={Button.variants.TEXT}>
                <span>I am children</span>
            </Button>
        );
        expect(screen.getByRole('button')).not.toBeEmptyDOMElement();
    });

    it('should include custom classes', () => {
        const classes = 'blue animate';
        render(
            <Button variant={Button.variants.TEXT} className={classes}>
                I am a button
            </Button>
        );
        expect(screen.getByRole('button')).toHaveClass(classes);
    });

    it('should render a button of type submit', () => {
        render(
            <Button variant={Button.variants.TEXT} submit>
                I am a button
            </Button>
        );
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
});
