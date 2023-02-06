import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SVGIcon from './SVGIcon';

describe('<Icon /> component', () => {
    it('should render an image', () => {
        render(<SVGIcon variant={SVGIcon.variants.SEARCH} />);
        expect(screen.queryByRole('img', { hidden: true })).toBeInTheDocument();
    });

    it('should not render an image', () => {
        render(<SVGIcon variant="doesNotExist" />);
        expect(
            screen.queryByRole('img', { hidden: true })
        ).not.toBeInTheDocument();
    });

    it('should include custom classes', () => {
        const classes = 'blue animate';
        render(
            <SVGIcon variant={SVGIcon.variants.SEARCH} className={classes} />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(classes);
    });
    it('should include leadership variant classes', () => {
        const classes = 'leadership';
        render(<SVGIcon variant={SVGIcon.variants.LEADERSHIP} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(classes);
    });
    it('should include daily alert variant classes', () => {
        const classes = 'daily-alert';
        render(<SVGIcon variant={SVGIcon.variants.DAILY_ALERT} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(classes);
    });
    it('should include management tip variant classes', () => {
        const classes = 'management-tip';
        render(
            <SVGIcon variant={SVGIcon.variants.MANAGEMENT_TIP} className="" />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(classes);
    });
    it('should include best of variant classes', () => {
        const classes = 'best-of';
        render(<SVGIcon variant={SVGIcon.variants.BEST_OF} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(classes);
    });
    it('should only include just icon class for search variant', () => {
        const defaultClass = 'icon';
        render(<SVGIcon variant={SVGIcon.variants.SEARCH} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for hamburger variant', () => {
        const defaultClass = 'icon';
        render(<SVGIcon variant={SVGIcon.variants.HAMBURGER} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the X variant', () => {
        const defaultClass = 'icon';
        render(<SVGIcon variant={SVGIcon.variants.X} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the user-in-shield variant', () => {
        const defaultClass = 'icon';
        render(
            <SVGIcon variant={SVGIcon.variants.USER_IN_SHIELD} className="" />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the caret variant', () => {
        const defaultClass = 'icon';
        render(<SVGIcon variant={SVGIcon.variants.CARET} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the arrow right nav variant', () => {
        const defaultClass = 'arrow-right-nav';
        render(
            <SVGIcon variant={SVGIcon.variants.ARROW_RIGHT_NAV} className="" />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the caret variant', () => {
        const defaultClass = 'circle-arrow-right';
        render(
            <SVGIcon
                variant={SVGIcon.variants.CIRCLE_ARROW_RIGHT}
                className=""
            />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the caret variant', () => {
        const defaultClass = 'circle-chevron-right';
        render(
            <SVGIcon
                variant={SVGIcon.variants.CIRCLE_CHEVRON_RIGHT}
                className=""
            />
        );
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the for you variant', () => {
        const defaultClass = 'for-you';
        render(<SVGIcon variant={SVGIcon.variants.FOR_YOU} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
    it('should only include just icon class for the "Magazine" variant', () => {
        const defaultClass = 'magazine';
        render(<SVGIcon variant={SVGIcon.variants.MAGAZINE} className="" />);
        expect(screen.getByRole('img', { hidden: true })).toHaveClass(
            defaultClass
        );
    });
});
