import React from 'react';
import PropTypes from 'prop-types';

function Alert({ intrusive, children, className, active }) {
    return active && children ? (
        <p
            className={className}
            role={intrusive ? 'alert' : null}
            aria-live={intrusive ? null : 'polite'}
        >
            {children}
        </p>
    ) : null;
}

Alert.defaultProps = {
    children: null,
    className: '',
    intrusive: false,
};

Alert.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    intrusive: PropTypes.bool,
};

export default Alert;
