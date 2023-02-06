import React from 'react';
import Anchor from 'Components/Anchor/Anchor';
import Logo from 'Components/Logo/Logo';
import styles from './FinePrint.module.scss';

const TestIds = {
    CONTAINER: 'container',
};

/**
 * The `FinePrint` component contains the copyright, trademark, and other
 * related links for use exclusively in the `Footer` component.
 *
 * @example
 * return <FinePrint />;
 */
function FinePrint() {
    return (
        <div className={styles.container} data-testid={TestIds.CONTAINER}>
            <Logo className={styles.logo} variant={Logo.variants.HBP_SHIELD} />
            <div className={styles['links-container']}>
                <ul className={styles['inline-nav-list']}>
                    <li>
                        <Anchor href="/corporate/about" className={styles.link}>
                            About Us
                        </Anchor>
                    </li>
                    <li>
                        <Anchor
                            href="/corporate/careers"
                            className={styles.link}
                        >
                            Careers
                        </Anchor>
                    </li>
                    <li>
                        <Anchor href="/privacy-policy" className={styles.link}>
                            Privacy Policy
                        </Anchor>
                    </li>
                    <li>
                        <Anchor
                            href="/corporate/cookie-policy"
                            className={styles.link}
                        >
                            Cookie Policy
                        </Anchor>
                    </li>
                    <li>
                        <Anchor
                            href="/corporate/copyright"
                            className={styles.link}
                        >
                            Copyright Information
                        </Anchor>
                    </li>
                    <li>
                        <Anchor
                            href="http://trademark.harvard.edu/pages/trademark-notice"
                            className={styles.link}
                        >
                            Trademark Policy
                        </Anchor>
                    </li>
                </ul>
                <div className={styles['business-links']}>
                    <p className={styles['business-links-title']}>
                        Harvard Business Publishing:
                    </p>
                    <ul className={styles['inline-nav-list']}>
                        <li>
                            <Anchor
                                href="https://hbsp.harvard.edu/"
                                className={styles.link}
                            >
                                Higher Education
                            </Anchor>
                        </li>
                        <li>
                            <Anchor
                                href="https://www.harvardbusiness.org/"
                                className={styles.link}
                            >
                                Corporate Learning
                            </Anchor>
                        </li>
                        <li>
                            <Anchor
                                href="https://hbr.org/"
                                className={styles.link}
                            >
                                Harvard Business Review
                            </Anchor>
                        </li>
                        <li>
                            <Anchor
                                href="http://www.hbs.edu/"
                                className={styles.link}
                            >
                                Harvard Business School
                            </Anchor>
                        </li>
                    </ul>
                </div>
                <p className={styles.copyright}>
                    Copyright ©{new Date().getFullYear()} Harvard Business
                    School Publishing. All rights reserved. Harvard Business
                    Publishing is an affiliate of Harvard Business School.
                </p>
            </div>
        </div>
    );
}

FinePrint.testIds = TestIds;

export default FinePrint;
