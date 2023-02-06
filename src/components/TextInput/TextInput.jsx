import React, { useId, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './TextInput.module.scss';

const Variants = {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    SEARCH: 'search',
};

const TextInput = forwardRef(
    (
        {
            textInputClassName,
            labelClassName,
            variant,
            name,
            label,
            ariaLabel,
            placeholder,
            onChange,
            required,
            disabled,
            value,
            'data-qa': qaTestSelector,
        },
        ref
    ) => {
        const textInputClasses = classNames({
            [textInputClassName]: true,
            [styles.input]: true,
        });
        const labelClasses = classNames({
            [labelClassName]: true,
            [styles.label]: true,
        });
        const textInputID = `text-input${useId()}`;

        return (
            <>
                <label className={labelClasses} htmlFor={textInputID}>
                    {label}
                </label>
                <input
                    className={textInputClasses}
                    readOnly={
                        disabled ||
                        (typeof value !== 'undefined' && onChange === null)
                    }
                    type={variant}
                    name={name}
                    id={textInputID}
                    aria-label={ariaLabel}
                    placeholder={placeholder}
                    onChange={onChange}
                    required={required}
                    ref={ref}
                    value={value}
                    data-qa={qaTestSelector}
                />
            </>
        );
    }
);

TextInput.displayName = 'TextInput';

TextInput.variants = Variants;

TextInput.defaultProps = {
    ariaLabel: null,
    textInputClassName: '',
    labelClassName: '',
    onChange: null,
    placeholder: null,
    required: false,
    disabled: false,
    value: undefined,
    'data-qa': null,
};

TextInput.propTypes = {
    ariaLabel: PropTypes.string,
    textInputClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    variant: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    'data-qa': PropTypes.string,
};

export default TextInput;
