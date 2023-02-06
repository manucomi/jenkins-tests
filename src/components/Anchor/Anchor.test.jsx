import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Anchor from './Anchor';

describe('<Anchor /> component', () => {
    const href = '#';
    const label = 'HBR on Instagram';

    it('should include custom classes', () => {
        const classes = 'blue animate';
        render(
            <Anchor href={href} className={classes}>
                I am a link
            </Anchor>
        );
        expect(screen.getByRole('link')).toHaveClass(classes);
    });

    it('should include the correct href', () => {
        render(<Anchor href={href}>I am a link</Anchor>);
        expect(screen.getByRole('link')).toHaveAttribute('href', href);
    });

    it('should include an aria-label', () => {
        render(
            <Anchor href={href} label={label}>
                I am a link
            </Anchor>
        );
        expect(screen.getByRole('link')).toHaveAttribute('aria-label', label);
    });

    it('should include rel and target attributes when newTab prop is true', () => {
        render(
            <Anchor href={href} newTab>
                I am a link
            </Anchor>
        );
        expect(screen.getByRole('link')).toHaveAttribute(
            'rel',
            'noopener noreferrer'
        );
        expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    });

    it('should fire onClick handler if provided', async () => {
        const fn = jest.fn();

        render(
            <Anchor href={href} onClick={fn}>
                I am a link
            </Anchor>
        );
        await userEvent.click(screen.getByRole('link'));
        expect(fn).toHaveBeenCalled();
    });
});
