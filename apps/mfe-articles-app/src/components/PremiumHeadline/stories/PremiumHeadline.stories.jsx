import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import PropTypes from 'prop-types';
import PremiumHeadline from '../PremiumHeadline';

function Template({ isVisible }) {
    const premiumArticle = MockArticle[3];

    useArticleStore.getState().setArticle(premiumArticle);
    return <PremiumHeadline isVisible={isVisible} />;
}

export default {
    title: 'Components/PremiumHeadline',
    component: PremiumHeadline,
    args: {
        isVisible: true,
    },
};

export const Default = {
    render: Template.bind({}),
};

Template.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};
