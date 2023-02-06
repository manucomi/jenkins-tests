import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import cookieCutter from 'cookie-cutter';
import classNames from 'classnames';
import Modal from 'Components/Modal/Modal';
import Button from 'Components/Button/Button';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import AdSlot from 'Components/AdSlot/AdSlot';
import useAdConsent from 'Hooks/useAdConsent/useAdConsent';
import styles from './InterstitialModal.module.scss';

function InterstitialModal({ mobileAdProps, desktopAdProps }) {
    const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isDesktopAdEmpty, setIsDesktopAdEmpty] = useState(null);
    const [isMobileAdEmpty, setIsMobileAdEmpty] = useState(null);
    const path = typeof window === 'object' ? window.location.href : '';
    const adConsent = useAdConsent();

    const isAdEmpty = useCallback(
        () => isDesktopAdEmpty !== false && isMobileAdEmpty !== false,
        [isDesktopAdEmpty, isMobileAdEmpty]
    );
    const isAdRendered = useCallback(
        () => isDesktopAdEmpty !== null && isMobileAdEmpty !== null,
        [isDesktopAdEmpty, isMobileAdEmpty]
    );
    const handleDesktopAdRender = useCallback(
        (event) => setIsDesktopAdEmpty(event.isEmpty),
        [setIsDesktopAdEmpty]
    );
    const handleMobileAdRender = useCallback(
        (event) => setIsMobileAdEmpty(event.isEmpty),
        [setIsMobileAdEmpty]
    );

    const modalWithClasses = classNames({
        [styles.modal]: true,
        [styles.closing]: isClosing,
        [styles['is-hidden']]: isAdEmpty(),
    });

    const modalBackdropWithClasses = classNames({
        [styles.closing]: isClosing,
        [styles['is-hidden']]: isAdEmpty(),
    });

    const adSizeMobile = useMemo(() => [[300, 250]], []);
    const adSizeDesktop = useMemo(() => [[640, 480]], []);

    const autoClose = setTimeout(() => setIsInterstitialOpen(false), 30000);

    const handleFadeOut = () => {
        setIsClosing(true);
        clearTimeout(autoClose);

        setTimeout(() => {
            setIsInterstitialOpen(false);
        }, 300);
    };

    useEffect(() => {
        const urlObject = new URL(path);
        const searchParams = new URLSearchParams(urlObject.search);
        const cmMmc = searchParams.get('cm_mmc');
        const hideIntromercial = searchParams.get('hideIntromercial');

        // "Protected" pages are pages in which the interstitial should NOT show.
        const checkProtectedPageParams = () => {
            // If you see these GET parameters in the URL then do not show the interstitial modal.
            if (
                cmMmc === 'email-_-rtb' ||
                cmMmc === 'email-_-so' ||
                cmMmc === 'cpc' ||
                hideIntromercial === 'true'
            ) {
                return false;
            }

            /*
             * The interstitial modal sets the marketing_interruption cookie
             * when the user first sees the modal. If present onload, don't
             * show moal again for 12 horus.
             * Piano will set the _pc_pso cookie if the user is currently
             * in the onboarding flow.
             */
            return (
                cookieCutter.get('_pc_pso') === undefined &&
                cookieCutter.get('marketing_interruption') === undefined
            );
        };

        if (adConsent && checkProtectedPageParams()) {
            setIsInterstitialOpen(true);
            const date = new Date();
            date.setTime(date.getTime() + 43200000);
            cookieCutter.set('marketing_interruption', 'overlay', {
                expires: date.toGMTString(),
            });
        }
    }, [adConsent, path]);

    return isInterstitialOpen &&
        (!isAdRendered() || (isAdRendered() && !isAdEmpty())) ? (
        <Modal
            label="Advertisement"
            onClose={handleFadeOut}
            backdropClassName={modalBackdropWithClasses}
            modalClassName={modalWithClasses}
            isFocusTrapped={!isAdEmpty()}
        >
            <Button
                variant={Button.variants.TEXT}
                label="Close the advertisement"
                className={styles['close-btn']}
                onClick={handleFadeOut}
            >
                <SVGIcon
                    variant={SVGIcon.variants.X}
                    className={styles['close-btn-icon']}
                />
            </Button>

            <p className={styles['ad-notice']}>Advertisement</p>

            <div className={styles['ad-container']}>
                <AdSlot
                    path={mobileAdProps.path}
                    size={mobileAdProps.size || adSizeMobile}
                    targets={mobileAdProps.targets || {}}
                    onSlotRender={handleMobileAdRender}
                />
                <AdSlot
                    path={desktopAdProps.path}
                    size={desktopAdProps.size || adSizeDesktop}
                    targets={desktopAdProps.targets || {}}
                    onSlotRender={handleDesktopAdRender}
                />
            </div>
        </Modal>
    ) : null;
}

InterstitialModal.defaultProps = {
    desktopAdProps: {
        path: '/34363400/HBR_640x480_WelcomeAd',
    },
    mobileAdProps: {
        path: '/34363400/HBR_300x250_WelcomeAd',
    },
};

InterstitialModal.propTypes = {
    desktopAdProps: PropTypes.shape({
        path: PropTypes.string.isRequired,
        size: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        targets: PropTypes.objectOf(PropTypes.string),
    }),
    mobileAdProps: PropTypes.shape({
        path: PropTypes.string.isRequired,
        size: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        targets: PropTypes.objectOf(PropTypes.string),
    }),
};

export default InterstitialModal;
