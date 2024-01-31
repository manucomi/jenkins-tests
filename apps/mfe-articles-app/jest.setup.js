import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import useArticleStore from 'stores/article/article.store';

afterEach(() => {
    act(() => {
        useArticleStore.getState().setArticle({});
    });
});
