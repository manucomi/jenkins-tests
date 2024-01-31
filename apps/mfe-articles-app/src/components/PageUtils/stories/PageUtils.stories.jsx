import useArticleStore from 'stores/article/article.store';
import PageUtils from '../PageUtils';

export default {
    title: 'Components/PageUtils',
    component: PageUtils,
};

function Template(args) {
    const { position } = args;
    const setArticle = useArticleStore((state) => state.setArticle);
    setArticle({ type: 'standard', title: 'Title Mock' });

    const infoText = () => {
        let text = '';
        if (position === PageUtils.position.TOP) {
            text = `When the Page Utility Bar is placed at the Top of the article content, it is only displayed for medium devices (768px < viewport < 1156px )`;
        } else if (position === PageUtils.position.LEFT) {
            text = `When the Page Utility Bar is positioned at the Left side, it is only displayed for large devices (viewport > 1156px)`;
        }

        return text;
    };

    return (
        <div style={{ maxWidth: '500px' }}>
            <p>{infoText()}</p>
            <PageUtils position={position} />
        </div>
    );
}

export const Top = {
    render: Template.bind({}),
    args: {
        position: PageUtils.position.TOP,
    },
};

export const Left = {
    render: Template.bind({}),
    args: {
        position: PageUtils.position.LEFT,
    },
};

export const Bottom = {
    render: Template.bind({}),
    args: {
        position: PageUtils.position.BOTTOM,
    },
};
