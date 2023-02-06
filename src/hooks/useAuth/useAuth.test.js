import { renderHook, act } from '@testing-library/react';
import useAuthStore from 'Stores/auth/auth.store';
import useAuth from './useAuth';

describe('useAuth', () => {
    it('should correctly set the auth state on the store', () => {
        const { result } = renderHook(() => useAuth());

        expect(useAuthStore.getState().isAuthenticated).toBe(false);

        act(() => result.current.setIsAuthenticated(true));

        expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
});
