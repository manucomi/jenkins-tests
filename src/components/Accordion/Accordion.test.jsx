import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Accordion, { AccordionTestIds } from './Accordion';

describe('<NavAccordion /> component', () => {
    it('should open and close', async () => {
        const mockText = 'Open me';
        render(
            <Accordion title={mockText}>
                <span>Boo!</span>
            </Accordion>
        );

        const details = screen.getByTestId(AccordionTestIds.CONTAINER);
        const summary = screen.getByText(mockText);
        expect(details).not.toHaveAttribute('open');

        await userEvent.click(summary);
        expect(details).toHaveAttribute('open');

        await userEvent.click(summary);
        expect(details).not.toHaveAttribute('open');
    });

    it('should include custom classes', () => {
        const classes = 'be excellent';
        render(
            <Accordion className={classes} title="to">
                <span>Each other</span>
            </Accordion>
        );
        expect(screen.getByTestId(AccordionTestIds.CONTAINER)).toHaveClass(
            classes
        );
    });
});
