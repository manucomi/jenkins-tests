import React, { useId, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './TextBox.module.scss';

const TextBox = forwardRef(
    (
        {
            textBoxClassName,
            labelClassName,
            name,
            ariaLabel,
            label,
            placeholder,
            onChange,
            required,
            'data-qa': qaTestSelector,
        },
        ref
    ) => {
        const textBoxClasses = classNames({
            [textBoxClassName]: true,
            [styles.textarea]: true,
        });
        const labelClasses = classNames({
            [labelClassName]: true,
            [styles.label]: true,
        });
        const textBoxID = `text-box${useId()}`;

        return (
            <>
                <label className={labelClasses} htmlFor={textBoxID}>
                    {label}
                </label>
                <textarea
                    className={textBoxClasses}
                    name={name}
                    id={textBoxID}
                    aria-label={ariaLabel}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    ref={ref}
                    data-qa={qaTestSelector}
                />
            </>
        );
    }
);

TextBox.displayName = 'TextBox';

TextBox.defaultProps = {
    ariaLabel: null,
    labelClassName: '',
    textBoxClassName: '',
    onChange: null,
    placeholder: null,
    required: false,
    'data-qa': null,
};

TextBox.propTypes = {
    ariaLabel: PropTypes.string,
    labelClassName: PropTypes.string,
    textBoxClassName: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    'data-qa': PropTypes.string,
};

export default TextBox;
