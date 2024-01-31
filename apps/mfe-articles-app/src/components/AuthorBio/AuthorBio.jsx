import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import styles from './AuthorBio.module.scss';

const getParsedBio = (authorBio) => {
    /* Note: This will change as we are going to use the 
       renderer package once it is completed. */
    const parsed = parse(authorBio);
    return parsed;
};

function AuthorBio({ author }) {
    const getAuthorInitials = (name) => {
        const authorInitials = name.match(/\b(\w)/g);
        if (authorInitials.length < 3) return authorInitials.join('');
        return [
            authorInitials[0],
            authorInitials[authorInitials.length - 1],
        ].join('');
    };

    return (
        <div className={styles['author-info-item']}>
            <div className={styles['image-container']}>
                {author.image ? (
                    <img
                        src={author.image}
                        alt=""
                        className={styles['author-picture']}
                    />
                ) : (
                    <div className={styles['author-picture']}>
                        {getAuthorInitials(author.name)}
                    </div>
                )}
            </div>
            <div className={styles.biography}>{getParsedBio(author.bio)}</div>
        </div>
    );
}

AuthorBio.propTypes = {
    author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        bio: PropTypes.string.isRequired,
    }).isRequired,
};

export default AuthorBio;
