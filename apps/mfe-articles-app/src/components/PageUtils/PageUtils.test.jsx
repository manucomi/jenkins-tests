import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import PageUtils from './PageUtils';

describe('<PageUtils /> component', () => {
    test('should render Utility bar at top position for Standard Articles', () => {
        useArticleStore.getState().setArticle({ ...MockArticle[2] });
        render(<PageUtils position={PageUtils.position.TOP} />);

        const utilityBar = screen.getByRole('list');

        expect(utilityBar).toHaveClass('container-top');
    });

    test('should render Utility bar at left position for Premium Articles', () => {
        useArticleStore.getState().setArticle({ ...MockArticle[3] });
        render(<PageUtils position={PageUtils.position.LEFT} />);

        const utilityBar = screen.getByRole('list');

        expect(utilityBar).toHaveClass('container-left');
    });

    test('should render Utility bar at bottom position for all Articles', () => {
        useArticleStore.getState().setArticle({ ...MockArticle[0] });
        render(<PageUtils position={PageUtils.position.BOTTOM} />);

        const utilityBar = screen.getByRole('list');
        expect(utilityBar).toHaveClass('container-bottom');
    });
});
