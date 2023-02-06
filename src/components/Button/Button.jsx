import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getDataProps from 'Helpers/getDataProps/getDataProps';
import styles from './Button.module.scss';

const Variants = {
    ALT: 'alternate',
    PRIMARY: 'primary',
    TEXT: 'text',
};

const Button = forwardRef(
    (
        {
            children,
            className,
            onClick,
            submit,
            variant,
            disabled,
            label,
            id,
            ariaExpanded,
            ...restProps
        },
        ref
    ) => {
        const classes = classNames({
            [styles.btn]: true,
            [className]: true,
            [styles.text]: variant === Variants.TEXT,
            [styles.primary]: variant === Variants.PRIMARY,
            [styles.alternate]: variant === Variants.ALT,
        });

        return (
            <button
                type={submit ? 'submit' : 'button'}
                aria-label={label}
                className={classes}
                aria-expanded={ariaExpanded}
                onClick={submit ? null : onClick}
                ref={ref}
                disabled={disabled}
                id={id}
                // Disabling this rule specifically to spread unpredictable data- props
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...getDataProps(restProps)}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

Button.variants = Variants;

Button.defaultProps = {
    className: '',
    disabled: false,
    label: null,
    onClick: null,
    submit: false,
    id: null,
    ariaExpanded: null,
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    submit: PropTypes.bool,
    variant: PropTypes.string.isRequired,
    id: PropTypes.string,
    ariaExpanded: PropTypes.bool,
};

export default Button;
