import { useState } from 'react';
import Header from 'mfe-core/ui/Header';
import Title from 'components/Title/Title';
import PrimaryAd from 'components/PrimaryAd/PrimaryAd';
import ArticleWrapper from 'components/ArticleWrapper/ArticleWrapper';
import RecommendedForYou from 'components/RecommendedForYou/RecommendedForYou';
import PremiumHeadline from 'components/PremiumHeadline/PremiumHeadline';
import { setupParser } from 'mfe-articles-renderer';
import useArticleStore from 'stores/article/article.store';
import MainTopicLink from 'components/MainTopicLink/MainTopicLink';
import PageUtils from 'components/PageUtils/PageUtils';
import PublicationDate from 'components/PublicationDate/PublicationDate';
import Hero from 'components/Hero/Hero';
import AuthorBioList from 'components/AuthorBioList/AuthorBioList';
import styles from './Premium.module.scss';

function Premium() {
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
                <PremiumHeadline isVisible={isVisible} />
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
                    <div className={styles.summary}>Summary section</div>
                    <div className={styles['left-rail']}>
                        <PageUtils position={PageUtils.position.LEFT} />
                    </div>
                    <div className={styles.content}>{parsedContent}</div>
                    <div className={styles['right-rail']}>
                        Right column section
                    </div>
                    <div className={styles.author}>
                        <AuthorBioList />
                    </div>
                    <div className={styles['bottom-utils']}>
                        <PageUtils position={PageUtils.position.BOTTOM} />
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

export default Premium;
