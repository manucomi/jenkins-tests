import useArticleStore from 'stores/article/article.store';
import AuthorBioList from '../AuthorBioList';

function Template() {
    const mockArticle = {
        authors: [
            {
                name: 'Nicholas Bloom',
                image: '/resources/images/article_assets/2014/08/110-nick-bloom.jpg',
                bio: 'Nicholas Bloom is a professor of economics at Stanford University.',
            },
            {
                name: 'George Serafeim',
                image: '',
                bio: 'George Serafeim is Vice President, Health System Strategy at Advisory Board. Follow him on Twitter <a href="https://twitter.com/GeorgeSerafeim">@georgeserafeim</a>.',
            },
        ],
    };
    const setArticle = useArticleStore((state) => state.setArticle);
    setArticle({ ...mockArticle });
    return <AuthorBioList />;
}

export default {
    title: 'Components/AuthorBioList',
    component: AuthorBioList,
};

export const Default = {
    render: Template.bind({}),
    name: 'AuthorBioList',
};
