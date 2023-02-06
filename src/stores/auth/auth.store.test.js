import useAuthStore from './auth.store';

describe('user store', () => {
    it('should set the isAuthenticated property', () => {
        expect(useAuthStore.getState().isAuthenticated).toBeFalsy();
        useAuthStore.getState().setIsAuthenticated(true);
        expect(useAuthStore.getState().isAuthenticated).toBeTruthy();
    });
});
