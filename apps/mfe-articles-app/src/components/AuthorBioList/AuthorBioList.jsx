import useArticleStore from 'stores/article/article.store';
import AuthorBio from 'components/AuthorBio/AuthorBio';
import styles from './AuthorBioList.module.scss';

function AuthorBioList() {
    const { authors } = useArticleStore((state) => state.article);

    return (
        authors.length > 0 && (
            <aside className={styles.container}>
                {authors.map((author) => (
                    <AuthorBio author={author} key={author.name} />
                ))}
            </aside>
        )
    );
}

export default AuthorBioList;
