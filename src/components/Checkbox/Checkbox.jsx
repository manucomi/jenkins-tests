import React, { useId } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontIcon from 'Components/FontIcon/FontIcon';
import styles from './Checkbox.module.scss';

function Checkbox({
    checkboxClassName,
    labelClassName,
    isChecked,
    label,
    onChange,
    afterLabel,
    disabled,
    'data-qa': qaTestSelector,
}) {
    const checkboxID = `checkbox${useId()}`;
    const labelID = `label${useId()}`;

    const checkboxClasses = classNames({
        [styles.checkbox]: true,
        [checkboxClassName]: true,
    });

    const labelClasses = classNames({
        [styles.label]: true,
        [labelClassName]: true,
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onChange();
        }
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <label
            className={labelClasses}
            htmlFor={checkboxID}
            id={labelID}
            onClick={disabled ? null : onChange}
        >
            {afterLabel && label}
            <span
                id={checkboxID}
                className={checkboxClasses}
                role="checkbox"
                aria-checked={isChecked}
                aria-disabled={disabled}
                aria-labelledby={labelID}
                onClick={disabled ? null : onChange}
                onKeyDown={disabled ? null : handleKeyDown}
                tabIndex={disabled ? '-1' : '0'}
                data-qa={qaTestSelector}
            >
                {isChecked && (
                    <FontIcon
                        variant={FontIcon.variants.CHECKMARK}
                        className={styles.checkmark}
                    />
                )}
            </span>
            {!afterLabel && label}
        </label>
    );
}

Checkbox.defaultProps = {
    checkboxClassName: '',
    labelClassName: '',
    afterLabel: false,
    disabled: false,
    'data-qa': null,
};

Checkbox.propTypes = {
    checkboxClassName: PropTypes.string,
    isChecked: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    afterLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    'data-qa': PropTypes.string,
};

export default Checkbox;
