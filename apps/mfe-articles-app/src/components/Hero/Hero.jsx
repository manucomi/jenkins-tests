import useArticleStore from 'stores/article/article.store';
import classNames from 'classnames';
import styles from './Hero.module.scss';

function Hero() {
    const { hero, type } = useArticleStore((state) => state.article);
    const articleType = type.replace(/\s+/g, '-');

    const creditClasses = classNames({
        [styles.credits]: true,
        [styles[articleType]]: true,
    });

    const captionAndCreditsClasses = classNames({
        [styles['container-caption-credits']]: true,
        [styles[articleType]]: true,
    });

    return (
        <>
            <img
                className={styles.img}
                src={hero.image.defaultSrc}
                sizes={hero.image.sizes}
                srcSet={hero.image.srcset}
                alt=""
            />
            <div className={captionAndCreditsClasses}>
                {hero.caption && (
                    <span className={styles.caption}>
                        {hero.caption} &nbsp;&nbsp;
                    </span>
                )}
                <span className={creditClasses}>{hero.credits}</span>
            </div>
        </>
    );
}

export default Hero;
