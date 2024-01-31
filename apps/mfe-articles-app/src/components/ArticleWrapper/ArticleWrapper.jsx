import PropTypes from 'prop-types';
import styles from './ArticleWrapper.module.scss';

function ArticleWrapper({ children }) {
    return <article className={styles.wrapper}>{children}</article>;
}

ArticleWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ArticleWrapper;
