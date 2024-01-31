import useArticleStore from 'stores/article/article.store';
import { MockArticle } from 'mfe-articles-shared';
import PropTypes from 'prop-types';
import StandardHeadline from '../StandardHeadline';

function Template({ isVisible }) {
    const standardArticle = MockArticle[2];

    useArticleStore.getState().setArticle(standardArticle);
    return <StandardHeadline isVisible={isVisible} />;
}

export default {
    title: 'Components/StandardHeadline',
    component: StandardHeadline,
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
