import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontIcon from 'Components/FontIcon/FontIcon';
import styles from './Accordion.module.scss';

const TestIds = {
    CONTAINER: 'container',
};

function Accordion({ children, className, title, isInitiallyOpen }) {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    const handleClick = (event) => {
        event.preventDefault();
        setIsOpen(!isOpen);
        return false;
    };
    const classes = classNames({
        [className]: true,
        [styles.container]: true,
        [styles.open]: isOpen,
    });

    return (
        <details
            data-testid={TestIds.CONTAINER}
            className={classes}
            open={isOpen}
        >
            <summary className={styles.title} onClick={handleClick}>
                {title}
                <FontIcon
                    className={styles['title-icon']}
                    variant={FontIcon.variants.CARET_RIGHT}
                />
            </summary>
            {children}
        </details>
    );
}

Accordion.defaultProps = {
    className: '',
    isInitiallyOpen: false,
};

Accordion.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    isInitiallyOpen: PropTypes.bool,
};

export default Accordion;
export { TestIds as AccordionTestIds };
