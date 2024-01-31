import useArticleStore from 'stores/article/article.store';
import { MockArticle } from 'mfe-articles-shared';
import PropTypes from 'prop-types';
import SpotlightHeadline from '../SpotlightHeadline';

function Template({ isVisible }) {
    const spotlightArticle = MockArticle[1];

    useArticleStore.getState().setArticle(spotlightArticle);
    return <SpotlightHeadline isVisible={isVisible} />;
}

export default {
    title: 'Components/SpotlightHeadline',
    component: SpotlightHeadline,
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
