import classNames from 'classnames';
import Anchor from 'mfe-core/ui/Anchor';
import PropTypes from 'prop-types';
import useArticleStore from 'stores/article/article.store';
import styles from './PremiumHeadline.module.scss';

const TestIds = {
    CONTAINER: 'premium-headline-container',
};

function PremiumHeadline({ isVisible }) {
    const article = useArticleStore((state) => state.article);

    const topicHref = `/${article.topics[0]
        .toLowerCase()
        .replace(/\s+/g, '-')}`;

    const containerClasses = classNames({
        [styles['content-container']]: true,
        [styles.visible]: isVisible,
    });

    return (
        <div className={containerClasses} data-testid={TestIds.CONTAINER}>
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

PremiumHeadline.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default PremiumHeadline;
export { TestIds as PremiumHeadlineTestIds };
