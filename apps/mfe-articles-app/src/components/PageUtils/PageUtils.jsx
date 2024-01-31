import classNames from 'classnames';
import useArticleStore from 'stores/article/article.store';
import PropTypes from 'prop-types';
import styles from './PageUtils.module.scss';
import buyCopyLogo from '../../assets/BuyCopy.svg';
import downloadLogo from '../../assets/Download.svg';
import facebookLogo from '../../assets/Facebook.svg';
import linkedInLogo from '../../assets/LinkedIn.svg';
import printLogo from '../../assets/Print.svg';
import saveLogo from '../../assets/Save.svg';
import twitterLogo from '../../assets/Twitter.svg';

const UTILS_POSITION = {
    TOP: 'top',
    LEFT: 'left',
    BOTTOM: 'bottom',
};

function PageUtils({ position }) {
    const articleType = useArticleStore((state) => state.article).type;

    const containerClasses = classNames({
        [styles['container-top']]: position === UTILS_POSITION.TOP,
        [styles['container-left']]: position === UTILS_POSITION.LEFT,
        [styles['container-bottom']]: position === UTILS_POSITION.BOTTOM,
        [styles[articleType]]: true,
    });

    const utilityNameClasses = classNames({
        [styles['utility-name']]: true,
        [styles[articleType]]: true,
    });

    const listItemClasses = classNames({
        [styles['list-item']]: true,
        [styles.vertical]: position === UTILS_POSITION.LEFT,
    });

    const hiddenHorizontalClasses = classNames({
        [listItemClasses]: true,
        [styles['hidden-horizontal-utility']]:
            position === UTILS_POSITION.BOTTOM,
        [styles[articleType]]: true,
    });

    return (
        <ul className={containerClasses}>
            <li className={listItemClasses}>
                <button className={styles['item-button']} type="button">
                    <img src={twitterLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Tweet</span>
                </button>
            </li>
            <li className={listItemClasses}>
                <button className={styles['item-button']} type="button">
                    <img src={facebookLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Post</span>
                </button>
            </li>

            <li className={listItemClasses}>
                <button className={styles['item-button']} type="button">
                    <img src={linkedInLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Share</span>
                </button>
            </li>
            <li className={listItemClasses}>
                <button className={styles['item-button']} type="button">
                    <img src={saveLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Save</span>
                </button>
            </li>
            <li className={`${hiddenHorizontalClasses}`}>
                <button className={styles['item-button']} type="button">
                    <img src={downloadLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Get PDF</span>
                </button>
            </li>
            <li className={`${hiddenHorizontalClasses}`}>
                <button className={styles['item-button']} type="button">
                    <img src={buyCopyLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Buy Copies</span>
                </button>
            </li>
            <li className={`${hiddenHorizontalClasses}`}>
                <button className={styles['item-button']} type="button">
                    <img src={printLogo.src} aria-hidden alt="" />
                    <span className={utilityNameClasses}>Print</span>
                </button>
            </li>
        </ul>
    );
}

PageUtils.propTypes = {
    position: PropTypes.string.isRequired,
};

PageUtils.position = UTILS_POSITION;
export default PageUtils;
