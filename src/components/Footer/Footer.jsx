import React, { useMemo, useState } from 'react';
import Anchor from 'Components/Anchor/Anchor';
import Logo from 'Components/Logo/Logo';
import Accordion from 'Components/Accordion/Accordion';
import FontIcon from 'Components/FontIcon/FontIcon';
import Button from 'Components/Button/Button';
import AuthModal from 'Components/AuthModal/AuthModal';
import useAuthStore from 'Stores/auth/auth.store';
import useUserStore from 'Stores/user/user.store';
import FinePrint from './FinePrint/FinePrint';
import footerLinks from './links';
import styles from './Footer.module.scss';

function Footer() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const targets = useMemo(
        () => ({
            ab: 'footer-subtout',
            tpcc: 'houseads.site.footer-subtout',
        }),
        []
    );

    const handleSignInOpen = () => {
        setIsSignInOpen(true);
    };

    const handleSignInClose = () => {
        setIsSignInOpen(false);
    };

    const isSubscribed = !!useUserStore((state) => state.profile)?.subscriber;
    const queryParams = useMemo(
        () =>
            Object.entries(targets).reduce(
                (accumulator, entry) =>
                    `${accumulator}&${entry[0]}=${entry[1]}`,
                ''
            ),
        [targets]
    );

    const subscribeURL = useMemo(() => {
        let url;

        if (isSubscribed) {
            url = `/gift-subscriptions?${queryParams.slice(1)}`;
        } else {
            url = `/subscriptions${
                queryParams.length ? `?${queryParams.slice(1)}` : ''
            }`;
        }

        return url;
    }, [isSubscribed, queryParams]);

    const renderNavList = (links) => (
        <ul className={styles['nav-list']}>
            {links.map((listItem) => {
                const requireSignIn = listItem.requireAuth || false;
                return (
                    <li
                        key={listItem.title || listItem.text}
                        className={styles['nav-list-item']}
                    >
                        {requireSignIn && !isAuthenticated ? (
                            <Button
                                variant={Button.variants.TEXT}
                                className={styles.link}
                                onClick={() => handleSignInOpen()}
                            >
                                {listItem.text}
                            </Button>
                        ) : (
                            <>
                                {listItem.icon && (
                                    <FontIcon
                                        className={styles['link-icon']}
                                        variant={listItem.icon}
                                    />
                                )}

                                <Anchor
                                    className={styles.link}
                                    href={listItem.href}
                                >
                                    {listItem.text}
                                </Anchor>
                            </>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    const renderAccordion = ({ category, links }) => (
        <Accordion title={category} className={styles.accordion}>
            {renderNavList(links)}
        </Accordion>
    );

    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles['top-content']}>
                        <div className={styles['logo-link-container']}>
                            <Anchor
                                className={`${styles.link} ${styles['logo-link']}`}
                                href="/"
                            >
                                <Logo
                                    className={styles.logo}
                                    variant={Logo.variants.HBR_SHIELD}
                                />
                            </Anchor>
                        </div>
                        <div className={styles['subscribe-link-container']}>
                            <Anchor
                                className={`${styles.link} ${styles['subscribe-link']}`}
                                href={subscribeURL}
                            >
                                {isSubscribed
                                    ? 'Give a Gift!'
                                    : 'Start my subscription!'}
                            </Anchor>
                        </div>
                    </div>
                    <nav className={styles.nav} aria-label="Comprehensive Menu">
                        {renderAccordion(footerLinks.explore)}
                        {renderAccordion(footerLinks.store)}
                        {renderAccordion(footerLinks.about)}
                        {renderAccordion(footerLinks.manage)}

                        <div className={styles['nav-list-wrapper']}>
                            <p className={styles['nav-list-title']}>
                                {footerLinks.explore.category}
                            </p>
                            {renderNavList(footerLinks.explore.links)}
                        </div>
                        <div className={styles['nav-list-wrapper']}>
                            <p className={styles['nav-list-title']}>
                                {footerLinks.store.category}
                            </p>
                            {renderNavList(footerLinks.store.links)}
                        </div>
                        <div className={styles['nav-list-wrapper']}>
                            <p className={styles['nav-list-title']}>
                                {footerLinks.about.category}
                            </p>
                            {renderNavList(footerLinks.about.links)}
                        </div>
                        <div className={styles['nav-list-wrapper']}>
                            <p className={styles['nav-list-title']}>
                                {footerLinks.manage.category}
                            </p>
                            {renderNavList(footerLinks.manage.links)}
                        </div>
                        <div
                            className={`${styles['nav-list-wrapper']} ${styles['follow-list']}`}
                        >
                            <p className={styles['nav-list-title']}>
                                {footerLinks.follow.category}
                            </p>
                            {renderNavList(footerLinks.follow.links)}
                        </div>
                    </nav>
                    <FinePrint />
                </div>
            </footer>
            {isSignInOpen && <AuthModal onClose={handleSignInClose} />}
        </>
    );
}

export default Footer;
