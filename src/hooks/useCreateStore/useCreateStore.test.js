import { act, renderHook } from '@testing-library/react';
import useCreateStore from './useCreateStore';

describe('useCreateStore', () => {
    it('should return values and setters from provided initial state', () => {
        const initialState = {
            name: 'Ben',
            isEnabled: false,
        };
        const { result } = renderHook(() => useCreateStore(initialState));

        expect(result.current.name).toBe('Ben');
        expect(typeof result.current.setName).toBe('function');
        expect(result.current.isEnabled).toBe(false);
        expect(typeof result.current.setIsEnabled).toBe('function');
    });
    it('should update value from initialState with setter', async () => {
        const initialState = {
            name: 'Ben',
        };
        const { result } = renderHook(() => useCreateStore(initialState));

        expect(result.current.name).toBe('Ben');

        act(() => {
            result.current.setName('Matthew');
        });

        expect(result.current.name).toBe('Matthew');
    });
});
