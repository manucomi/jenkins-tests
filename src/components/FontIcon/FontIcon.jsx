import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FontIcon.module.scss';

const Variants = {
    BOOKMARK: 'bookmark',
    CARET_DOWN: 'caret down',
    CARET_RIGHT: 'caret right',
    CHECKMARK: 'checkmark',
    COPY: 'copy',
    PLUS_CIRCLE: 'plus circle',
    CHECKMARK_CIRCLE: 'checkmark circle',
    FACEBOOK: 'facebook',
    INSTAGRAM: 'instagram',
    LINKEDIN: 'linkedin',
    PLUS: 'plus',
    RSS: 'rss',
    SHARE: 'share',
    TWITTER: 'twitter',
};

function FontIcon({ className, label, variant }) {
    const classes = classNames({
        [styles.icon]: true,
        [className]: true,
        [styles.bookmark]: variant === Variants.BOOKMARK,
        [styles['caret-down']]: variant === Variants.CARET_DOWN,
        [styles['caret-right']]: variant === Variants.CARET_RIGHT,
        [styles.checkmark]: variant === Variants.CHECKMARK,
        [styles.copy]: variant === Variants.COPY,
        [styles['plus-circle']]: variant === Variants.PLUS_CIRCLE,
        [styles['checkmark-circle']]: variant === Variants.CHECKMARK_CIRCLE,
        [styles.facebook]: variant === Variants.FACEBOOK,
        [styles.instagram]: variant === Variants.INSTAGRAM,
        [styles.linkedin]: variant === Variants.LINKEDIN,
        [styles.plus]: variant === Variants.PLUS,
        [styles.rss]: variant === Variants.RSS,
        [styles.share]: variant === Variants.SHARE,
        [styles.twitter]: variant === Variants.TWITTER,
    });

    return (
        <span
            className={classes}
            aria-label={label}
            role={label ? 'img' : 'presentation'}
        />
    );
}

FontIcon.variants = Variants;

FontIcon.defaultProps = {
    className: '',
    label: null,
};

FontIcon.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    variant: PropTypes.string.isRequired,
};

export default FontIcon;
