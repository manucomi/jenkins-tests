import useArticleStore from 'stores/article/article.store';
import classNames from 'classnames';
import styles from './RecommendedForYou.module.scss';

function RecommendedForYou() {
    const article = useArticleStore((state) => state.article);

    const containerClasses = classNames({
        [styles['recommended-container']]: true,
        [styles[article.type]]: true,
    });

    return (
        <section className={containerClasses}>
            <h2 className={styles.headline}>Recommended For You</h2>
            <div className={styles['tiles-container']}>
                {article.recommendations?.articles.map((item, index) => {
                    return (
                        <a
                            className={styles['recommended-item']}
                            href={`${item.href}?ab=at_art_art_1x4_s0${
                                index + 1
                            }`}
                            title={item.title}
                            key={item.title}
                        >
                            <img
                                src={item.thumbnail}
                                className={styles['recommended-image']}
                                alt={item.title}
                                loading="lazy"
                            />
                            <div className={styles['recommended-text']}>
                                <span className={styles['content-type']}>
                                    {item.contentType}
                                </span>
                                <div>{item.title}</div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}

export default RecommendedForYou;
