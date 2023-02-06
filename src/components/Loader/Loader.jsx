import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Loader.module.scss';

const TestIds = {
    CONTAINER: 'container',
};

function Loader({ className }) {
    const classes = classNames({
        [className]: true,
        [styles.loader]: true,
    });

    return (
        <div className={classes} data-testid={TestIds.CONTAINER}>
            <div className={styles.rotation}>
                <div className={styles.filler}>
                    <div className={styles.mask} />
                </div>
            </div>
        </div>
    );
}

Loader.defaultProps = {
    className: '',
};

Loader.propTypes = {
    className: PropTypes.string,
};

export default Loader;
export { TestIds as LoaderTestIds };
