import classNames from 'classnames';
import Anchor from 'mfe-core/ui/Anchor';
import PropTypes from 'prop-types';
import useArticleStore from 'stores/article/article.store';
import styles from './StandardHeadline.module.scss';

function StandardHeadline({ isVisible }) {
    const article = useArticleStore((state) => state.article);

    const topicHref = `/${article.topics[0]
        .toLowerCase()
        .replace(/\s+/g, '-')}`;

    const containerClasses = classNames({
        [styles['content-container']]: true,
        [styles.visible]: isVisible,
    });

    return (
        <div className={containerClasses}>
            <span className={styles['headline-topic']}>
                <Anchor
                    className={styles['headline-topic-anchor']}
                    href={topicHref}
                >
                    {article.topics[0]}
                </Anchor>
            </span>
            <span className={styles['headline-separator']}>|</span>
            <span className={styles['headline-title']}>{article.title}</span>
        </div>
    );
}

StandardHeadline.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default StandardHeadline;
