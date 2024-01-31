import classNames from 'classnames';
import PropTypes from 'prop-types';
import useArticleStore from 'stores/article/article.store';
import styles from './SpotlightHeadline.module.scss';

function SpotlightHeadline({ isVisible }) {
    const article = useArticleStore((state) => state.article);

    const containerClasses = classNames({
        [styles['content-container']]: true,
        [styles.visible]: isVisible,
    });

    return (
        <div className={containerClasses}>
            <span className={styles['headline-title']}>Spotlight Series</span>
            <span className={styles['headline-separator']}>/</span>
            <span className={styles['headline-series']}>
                {article.series.title}
            </span>
        </div>
    );
}

SpotlightHeadline.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default SpotlightHeadline;
