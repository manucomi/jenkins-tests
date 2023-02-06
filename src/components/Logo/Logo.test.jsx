import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Logo from './Logo';

describe('<Logo /> component', () => {
    it('should include custom classes', () => {
        const classes = 'blue gradient';
        render(<Logo variant={Logo.variants.HBR_SHIELD} className={classes} />);
        expect(screen.getByRole('img')).toHaveClass(classes);
    });

    it('should render a valid variant', () => {
        const { rerender } = render(
            <Logo variant={Logo.variants.HBR_SHIELD} />
        );
        expect(screen.queryByRole('img')).toBeInTheDocument();

        rerender(<Logo variant="doesNotExist" />);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        rerender(<Logo variant={Logo.variants.HBP_SHIELD} />);
        expect(screen.queryByRole('img')).toBeInTheDocument();

        rerender(<Logo variant={Logo.variants.HBR_NO_SHIELD} />);
        expect(screen.queryByRole('img')).toBeInTheDocument();
    });
});
