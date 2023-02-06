import useMegaMenuStore from './MegaMenu.store';

describe('<MegaMenu /> store', () => {
    it('should set the isAutoSuggestOpen state', () => {
        expect(useMegaMenuStore.getState().isAutoSuggestOpen).toBe(false);
        useMegaMenuStore.getState().setIsAutoSuggestOpen(true);
        expect(useMegaMenuStore.getState().isAutoSuggestOpen).toBe(true);
    });
});
