import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Anchor from 'Components/Anchor/Anchor';
import useUserStore from 'Stores/user/user.store';
import styles from './NavBar.module.scss';

/**
 * The `NavBar` component contains quick navigation for hbr.org and is used
 * exclusively in the `Header`.
 *
 * @example
 * return <NavBar className={styles.nav} />;
 */
function NavBar({ className }) {
    const withClasses = classNames({
        [styles.nav]: true,
        [className]: className,
    });
    const profile = useUserStore((state) => state.profile);
    const isHmmEligible = profile?.subscriber?.isHmmEligible;

    return (
        <nav className={withClasses} aria-label="Quick Menu">
            <ul className={styles.list}>
                <li>
                    <Anchor
                        className={styles.link}
                        href="/insight-center/race-equity-and-power-at-work"
                    >
                        Diversity
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/the-latest">
                        Latest
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/magazine">
                        Magazine
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/ascend">
                        Ascend
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/topics">
                        Topics
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/podcasts">
                        Podcasts
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/video">
                        Video
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/store">
                        Store
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/big-ideas">
                        The Big Idea
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/data-visuals">
                        Data &amp; Visuals
                    </Anchor>
                </li>
                <li>
                    <Anchor className={styles.link} href="/case-selections">
                        Case Selections
                    </Anchor>
                </li>
                {isHmmEligible && (
                    <li>
                        <Anchor className={styles.link} href="/learning">
                            HBR Learning
                        </Anchor>
                    </li>
                )}
            </ul>
        </nav>
    );
}

NavBar.defaultProps = {
    className: '',
};

NavBar.propTypes = {
    className: PropTypes.string,
};

export default NavBar;
