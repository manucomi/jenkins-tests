import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert from './Alert';

describe('<Alert /> component', () => {
    it('should include custom classes', () => {
        const mockClasses = 'red big';
        const alertText = 'help!';
        render(
            <Alert active className={mockClasses}>
                {alertText}
            </Alert>
        );
        expect(screen.getByText(alertText)).toHaveClass(mockClasses);
    });

    it('should be assertive', () => {
        render(
            <Alert active intrusive>
                Help!
            </Alert>
        );
        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should not render an alert', () => {
        const { rerender } = render(<Alert active intrusive />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        rerender(
            <Alert active intrusive>
                Help!
            </Alert>
        );
        expect(screen.queryByRole('alert')).toBeInTheDocument();

        rerender(
            <Alert active={false} intrusive>
                Help!
            </Alert>
        );
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
