import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import useArticleStore from '../../stores/article/article.store';
import useArticle from './useArticle';

const mockArticle = {
    title: 11,
    type: 'big idea',
    tag: 'blogs.harvardbusiness.org,2007-03-31:999.235674',
    dek: 'Speeding a new product to market can have serious consequences. Consider the Rock ’n Play.',
};

describe('useUser', () => {
    it('should set the article', () => {
        const { result } = renderHook(() => useArticle());
        expect(Object.keys(result.current.article).length).toBe(0);
        act(() => result.current.setArticle(mockArticle));
        expect(useArticleStore.getState().article).toBe(mockArticle);
    });
});
