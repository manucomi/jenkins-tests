import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FontIcon from './FontIcon';
import styles from './FontIcon.module.scss';

describe('<FontIcon /> component', () => {
    it(`should render an icon of variant: ${FontIcon.variants.CARET_RIGHT}`, () => {
        render(<FontIcon variant={FontIcon.variants.CARET_RIGHT} />);
        expect(screen.getByRole('presentation')).toHaveClass(
            styles['caret-right']
        );
    });

    it(`should render an icon of variant: ${FontIcon.variants.INSTAGRAM}`, () => {
        render(<FontIcon variant={FontIcon.variants.INSTAGRAM} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.instagram);
    });

    it(`should render an icon of variant: ${FontIcon.variants.LINKEDIN}`, () => {
        render(<FontIcon variant={FontIcon.variants.LINKEDIN} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.linkedin);
    });

    it(`should render an icon of variant: ${FontIcon.variants.TWITTER}`, () => {
        render(<FontIcon variant={FontIcon.variants.TWITTER} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.twitter);
    });

    it(`should render an icon of variant: ${FontIcon.variants.RSS}`, () => {
        render(<FontIcon variant={FontIcon.variants.RSS} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.rss);
    });

    it(`should render an icon of variant: ${FontIcon.variants.FACEBOOK}`, () => {
        render(<FontIcon variant={FontIcon.variants.FACEBOOK} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.facebook);
    });

    it('should not render an icon variant', () => {
        render(<FontIcon variant="doesNotExist" />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.icon, {
            exact: true,
        });
    });

    it(`should render an icon of variant: ${FontIcon.variants.BOOKMARK}`, () => {
        render(<FontIcon variant={FontIcon.variants.BOOKMARK} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.bookmark);
    });

    it(`should render an icon of variant: ${FontIcon.variants.CARET_DOWN}`, () => {
        render(<FontIcon variant={FontIcon.variants.CARET_DOWN} />);
        expect(screen.getByRole('presentation')).toHaveClass(
            styles['caret-down']
        );
    });

    it(`should render an icon of variant: ${FontIcon.variants.COPY}`, () => {
        render(<FontIcon variant={FontIcon.variants.COPY} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.copy);
    });

    it(`should render an icon of variant: ${FontIcon.variants.SHARE}`, () => {
        render(<FontIcon variant={FontIcon.variants.SHARE} />);
        expect(screen.getByRole('presentation')).toHaveClass(styles.share);
    });

    it('should render an icon with an img role', () => {
        render(
            <FontIcon
                variant={FontIcon.variants.FACEBOOK}
                label="I am an icon"
            />
        );
        expect(screen.queryByRole('img')).toBeInTheDocument();
    });

    it('should render an icon with a presentation role', () => {
        render(<FontIcon variant={FontIcon.variants.FACEBOOK} />);
        expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });
});
