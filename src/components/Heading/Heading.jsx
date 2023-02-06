import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import numericRangeValidator from 'Helpers/numericRangeValidator/numericRangeValidator';
import styles from './Heading.module.scss';

function Heading({ level, children, className }) {
    const Tag = `h${level}`;

    const classes = classNames({
        [className]: true,
        [styles[`level-${level}`]]: styles[`level-${level}`],
    });

    return <Tag className={classes}>{children}</Tag>;
}

Heading.defaultProps = {
    className: '',
};

Heading.propTypes = {
    children: PropTypes.node.isRequired,
    level: numericRangeValidator(1, 6).isRequired,
    className: PropTypes.string,
};

export default Heading;
