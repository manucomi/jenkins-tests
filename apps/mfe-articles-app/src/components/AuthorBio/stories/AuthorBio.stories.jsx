import AuthorBio from '../AuthorBio';

function Template(args) {
    const { author } = args;
    return <AuthorBio author={author} />;
}

export default {
    title: 'Components/AuthorBio',
    component: AuthorBio,
};

export const AuthorImage = {
    render: Template.bind({}),
    args: {
        author: {
            name: 'Nicholas Bloom',
            image: '/resources/images/article_assets/2014/08/110-nick-bloom.jpg',
            bio: 'Nicholas Bloom is a professor of economics at Stanford University.',
        },
    },
};

export const AuthorInitials = {
    render: Template.bind({}),
    args: {
        author: {
            name: 'George Serafeim',
            image: '',
            bio: 'George Serafeim is Vice President, Health System Strategy at Advisory Board. Follow him on Twitter <a href="https://twitter.com/GeorgeSerafeim">@georgeserafeim</a>.',
        },
    },
};
