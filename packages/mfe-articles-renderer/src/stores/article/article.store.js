import { create } from 'zustand';

const useArticleStore = create((set) => ({
    article: {},
    setArticle: (article) => set(() => ({ article })),
}));

export default useArticleStore;
