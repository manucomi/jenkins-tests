import useArticleStore from 'stores/article/article.store';
import classNames from 'classnames';
import styles from './Title.module.scss';

function Title() {
    const article = useArticleStore((state) => state.article);
    const { title, type } = article;
    const articleType = type.replace(/\s+/g, '-');

    const headlineContainerClasses = classNames({
        [styles['headline-container']]: true,
        [styles[articleType]]: true,
    });

    const titleClasses = classNames({
        [styles.title]: true,
        [styles[articleType]]: true,
    });

    return (
        <div className={headlineContainerClasses}>
            <h1 className={titleClasses}>{title}</h1>
        </div>
    );
}

export default Title;
