import useArticleStore from 'stores/article/article.store';
import classNames from 'classnames';
import Anchor from 'mfe-core/ui/Anchor';
import styles from './MainTopicLink.module.scss';

function MainTopicLink() {
    const article = useArticleStore((state) => state.article);
    const articleType = article.type.replace(/\s+/g, '-');
    const mainTopic = article.topics[0];
    const topicHref = `/topic/subject/${article.topics[0]
        .toLowerCase()
        .replace(/\s+/g, '-')}`;

    const classes = classNames({
        [styles.container]: true,
        [styles[articleType]]: true,
    });

    return (
        <div className={classes}>
            <Anchor className={styles.topic} href={topicHref}>
                {mainTopic}
            </Anchor>
        </div>
    );
}

export default MainTopicLink;
