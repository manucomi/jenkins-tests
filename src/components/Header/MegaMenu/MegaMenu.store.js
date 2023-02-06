import create from 'zustand';

const useMegaMenuStore = create((set) => ({
    isAutoSuggestOpen: false,
    setIsAutoSuggestOpen: (isAutoSuggestOpen) =>
        set(() => ({ isAutoSuggestOpen })),
}));

export default useMegaMenuStore;
