import Anchor from 'mfe-core/ui/Anchor';
import useArticleStore from 'stores/article/article.store';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './BigIdeaHeadline.module.scss';

function BigIdeaHeadline({ onHeader }) {
    const article = useArticleStore((state) => state.article);

    const containerClasses = classNames({
        [styles['headline-container-header']]: onHeader,
        [styles['headline-container']]: !onHeader,
    });

    return (
        <div className={containerClasses}>
            <span className={styles['headline-title']}>
                <Anchor
                    href="/big-ideas"
                    className={styles['headline-title-anchor']}
                >
                    The Big Idea Series
                </Anchor>
            </span>
            <span className={styles['headline-separator']}>/</span>
            <span className={styles['headline-series']}>
                {article.series.title}
            </span>
        </div>
    );
}

BigIdeaHeadline.defaultProps = {
    onHeader: false,
};

BigIdeaHeadline.propTypes = {
    onHeader: PropTypes.bool,
};

export default BigIdeaHeadline;
