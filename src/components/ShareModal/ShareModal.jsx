/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Modal from 'Components/Modal/Modal';
import Button from 'Components/Button/Button';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import TextInput from 'Components/TextInput/TextInput';
import FontIcon from 'Components/FontIcon/FontIcon';
import Anchor from 'Components/Anchor/Anchor';
import Heading from 'Components/Heading/Heading';
import DataLayer from 'Domains/DataLayer/DataLayer';
import styles from './ShareModal.module.scss';

const ShareOptions = [
    {
        name: 'Facebook',
        icon: FontIcon.variants.FACEBOOK,
        actionName: 'Share On Facebook',
        actionType: 'BUTTON',
    },
    {
        name: 'LinkedIn',
        icon: FontIcon.variants.LINKEDIN,
        actionName: 'Share On LinkedIn',
        actionType: 'BUTTON',
    },
    {
        name: 'Twitter',
        icon: FontIcon.variants.TWITTER,
        actionName: 'Share On Twitter',
        actionType: 'LINK',
    },
];

function ShareModal({
    onClose,
    shareData,
    shareOnFacebook,
    shareOnLinkedin,
    shareOnTwitter,
}) {
    useEffect(() => {
        const dataLayer = new DataLayer(window.digitalData);
        dataLayer.setInitiatedShareEvent(shareData.title, shareData.type);
        dataLayer.updateEvent();
    }, [shareData.title, shareData.type]);

    const triggerDataLayerEvent = (shareType) => {
        const dataLayer = new DataLayer(window.digitalData);
        dataLayer.setCompletedShareEvent(
            shareData.title,
            shareData.title,
            shareType
        );
        dataLayer.updateEvent();
    };

    const shareCallback = (url, name) => {
        const callbacks = {
            Facebook: shareOnFacebook,
            LinkedIn: shareOnLinkedin,
            Twitter: shareOnTwitter,
        };
        return callbacks[name]?.(url) ?? 'Not supported callback';
    };

    return (
        <Modal
            label="Share an article on social media"
            onClose={onClose}
            backdropClassName={styles.backdrop}
            modalClassName={styles.modal}
            isFocusTrapped
            isCentered
        >
            <div className={styles['title-container']}>
                <div className={styles.title}>
                    Share
                    <Heading level={4} className={styles['title-inline']}>
                        {shareData.title}
                    </Heading>
                </div>

                <Button
                    variant={Button.variants.TEXT}
                    className={styles['close-btn']}
                    onClick={onClose}
                    label="Close the share dialog"
                >
                    <SVGIcon
                        variant={SVGIcon.variants.X}
                        className={styles['close-btn-icon']}
                    />
                </Button>
            </div>
            <div className={styles['url-container']}>
                <TextInput
                    textInputClassName={styles.input}
                    labelClassName={styles.label}
                    variant={TextInput.variants.TEXT}
                    value={shareData.url}
                    name="URL"
                    label="URL"
                />
            </div>

            <Tabs className={styles.content}>
                <TabList className={styles['tab-list']}>
                    {ShareOptions.map((option) => {
                        return (
                            <Tab
                                selectedClassName={styles['share-active']}
                                className={styles['share-link']}
                                key={option.name}
                            >
                                {option.name}
                            </Tab>
                        );
                    })}
                </TabList>
                {ShareOptions.map(({ name, icon, actionName, actionType }) => {
                    return (
                        <TabPanel key={name}>
                            <div className={styles['icon-container']}>
                                <FontIcon
                                    className={styles['share-icon']}
                                    variant={icon}
                                />
                            </div>
                            <div className={styles['button-container']}>
                                {actionType === 'BUTTON' && (
                                    <Button
                                        className={styles['share-button']}
                                        onClick={() => {
                                            triggerDataLayerEvent(name);
                                            shareCallback(shareData.url, name);
                                        }}
                                        variant={Button.variants.ALT}
                                        data-qa={`share-button-${name}`}
                                    >
                                        {actionName}
                                    </Button>
                                )}

                                {actionType === 'LINK' && (
                                    <Anchor
                                        className={styles['share-button']}
                                        href={shareCallback(
                                            shareData.url,
                                            name
                                        )}
                                        newTab
                                        data-qa={`share-button-${name}`}
                                        onClick={() => {
                                            const dataLayer = new DataLayer(
                                                window.digitalData
                                            );
                                            dataLayer.setInitiatedShareEvent(
                                                shareData.title,
                                                shareData.type
                                            );
                                        }}
                                    >
                                        {actionName}
                                    </Anchor>
                                )}
                            </div>
                        </TabPanel>
                    );
                })}
            </Tabs>
        </Modal>
    );
}

ShareModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    shareData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
    shareOnFacebook: PropTypes.func.isRequired,
    shareOnLinkedin: PropTypes.func.isRequired,
    shareOnTwitter: PropTypes.func.isRequired,
};

export default ShareModal;
