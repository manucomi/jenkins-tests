import useArticleStore from 'stores/article/article.store';
import Title from '../Title';

function Template(args) {
    const { title, type } = args;
    const setArticle = useArticleStore((state) => state.setArticle);
    setArticle({ title, type });

    return <Title />;
}

export default {
    title: 'Components/Title',
    component: Title,
    argTypes: {
        type: {
            options: ['standard', 'big idea', 'spotlight'],
            control: { type: 'radio' },
        },
    },
};

export const Default = {
    args: {
        title: 'Demo Title',
        type: 'standard',
    },
    render: Template.bind({}),
};
