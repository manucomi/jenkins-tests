import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getDataProps from 'Helpers/getDataProps/getDataProps';
import styles from './Anchor.module.scss';

const Anchor = forwardRef(
    (
        {
            children,
            className,
            href,
            label,
            newTab,
            onClick,
            tabIndex,
            ...restProps
        },
        ref
    ) => {
        const classes = classNames({
            [styles.anchor]: true,
            [className]: !!className,
        });

        return (
            // eslint-disable-next-line react/jsx-no-target-blank
            <a
                aria-label={label}
                className={classes}
                href={href}
                onClick={
                    onClick
                        ? (...args) => {
                              onClick(...args);
                              return true;
                          }
                        : null
                }
                ref={ref}
                rel={newTab ? 'noopener noreferrer' : null}
                tabIndex={tabIndex}
                target={newTab ? '_blank' : null}
                // Disabling this rule specifically to spread unpredictable data- props
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...getDataProps(restProps)}
            >
                {children}
            </a>
        );
    }
);

Anchor.displayName = 'Anchor';

Anchor.defaultProps = {
    className: '',
    label: null,
    newTab: false,
    onClick: null,
    tabIndex: null,
};

Anchor.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    label: PropTypes.string,
    newTab: PropTypes.bool,
    onClick: PropTypes.func,
    tabIndex: PropTypes.number,
};

export default Anchor;
