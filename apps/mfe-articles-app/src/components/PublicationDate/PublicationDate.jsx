import PropTypes from 'prop-types';
import classNames from 'classnames';
import useArticleStore from 'stores/article/article.store';
import Anchor from 'mfe-core/ui/Anchor';
import styles from './PublicationDate.module.scss';

const Variants = {
    TOP: 'top',
    BOTTOM: 'bottom',
};

function PublicationDate({ position }) {
    const article = useArticleStore((state) => state.article);
    const hasIssueData = Object.entries(article.issue).length > 0;
    const articleType = article.type.replace(/\s+/g, '-');

    const containerClasses = classNames({
        [styles['magazine-date-container']]: hasIssueData,
        [styles['non-magazine-date-container']]: !hasIssueData,
        [styles[articleType]]: true,
    });

    if (position === Variants.TOP) {
        if (hasIssueData) {
            const dateString = `From the Magazine (${article.issue.coverDate})`;
            const href = `/archive-toc/${article.issue.issueId}`;
            return (
                <div className={containerClasses}>
                    <Anchor className={styles['magazine-date']} href={href}>
                        {dateString}
                    </Anchor>
                </div>
            );
        }
        const dateObj = new Date(article.published);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return (
            <div className={containerClasses}>
                <span className={styles['non-magazine-date']}>
                    {formattedDate}
                </span>
            </div>
        );
    }
    if (position === Variants.BOTTOM) {
        if (hasIssueData) {
            const href = `/archive-toc/${article.issue.issueId}`;
            return (
                <div className={styles['bottom-magazine-date-container']}>
                    <span className={styles['bottom-magazine-date']}>
                        A version of this article appeared in the&nbsp;
                        <Anchor
                            className={styles['bottom-magazine-date-anchor']}
                            href={href}
                        >
                            {article.issue.coverDate}
                        </Anchor>
                        &nbsp;issue of <em>Harvard Business Review.</em>
                    </span>
                </div>
            );
        }
    }
}

PublicationDate.variants = Variants;

PublicationDate.defaultProps = {
    position: Variants.TOP,
};

PublicationDate.propTypes = {
    position: PropTypes.string,
};

export default PublicationDate;
