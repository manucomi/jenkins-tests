import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import Spotlight from './Spotlight';

describe('<Spotlight />', () => {
    it('renders the title text', () => {
        const spotlightArticle = MockArticle[1];

        useArticleStore
            .getState()
            .setArticle({ ...spotlightArticle, content: 'some text' });
        render(<Spotlight />);
        const titleElement = screen.getByText(spotlightArticle.series.title);
        expect(titleElement).toBeInTheDocument();
    });
});
