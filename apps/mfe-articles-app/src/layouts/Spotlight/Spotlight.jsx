import { useState } from 'react';
import Header from 'mfe-core/ui/Header';
import Title from 'components/Title/Title';
import PrimaryAd from 'components/PrimaryAd/PrimaryAd';
import ArticleWrapper from 'components/ArticleWrapper/ArticleWrapper';
import RecommendedForYou from 'components/RecommendedForYou/RecommendedForYou';
import SpotlightHeadline from 'components/SpotlightHeadline/SpotlightHeadline';
import { setupParser } from 'mfe-articles-renderer';
import useArticleStore from 'stores/article/article.store';
import MainTopicLink from 'components/MainTopicLink/MainTopicLink';
import PageUtils from 'components/PageUtils/PageUtils';
import Hero from 'components/Hero/Hero';
import PublicationDate from 'components/PublicationDate/PublicationDate';
import AuthorBioList from 'components/AuthorBioList/AuthorBioList';
import styles from './Spotlight.module.scss';

function Spotlight() {
    const article = useArticleStore((state) => state.article);
    const parseContent = setupParser();
    const parsedContent = parseContent(article.content);
    const [isVisible, setIsVisible] = useState(false);

    const handleScrollCallback = (visible) => {
        setIsVisible(visible);
    };
    return (
        <>
            <Header showAd={false} scrollCallback={handleScrollCallback}>
                <SpotlightHeadline isVisible={isVisible} />
            </Header>
            <ArticleWrapper>
                <PrimaryAd />
                <div className={styles.container}>
                    <div className={styles['article-header']}>
                        <MainTopicLink />
                        <Title />
                        <PublicationDate />
                    </div>
                    <div className={styles['hero-image']}>
                        <Hero />
                    </div>
                    <div className={styles['top-series-nav']}>
                        Top series nav section
                    </div>
                    <div className={styles.summary}>Summary section</div>
                    <div className={styles['left-rail']}>
                        <PageUtils position={PageUtils.position.LEFT} />
                    </div>
                    <div className={styles.content}>
                        <div>{parsedContent}</div>
                    </div>
                    <div className={styles['right-rail']}>
                        Right column section
                    </div>
                    <div className={styles.author}>
                        <PublicationDate
                            position={PublicationDate.variants.BOTTOM}
                        />
                        <AuthorBioList />
                    </div>
                    <div className={styles['bottom-utils']}>
                        <PageUtils position={PageUtils.position.BOTTOM} />
                    </div>

                    <div className={styles['bottom-series-nav']}>
                        Bottom series nav
                    </div>
                    <div className={styles['bottom-related-topics']}>
                        Bottom related topics
                    </div>
                </div>
            </ArticleWrapper>
            <RecommendedForYou />
        </>
    );
}

export default Spotlight;
