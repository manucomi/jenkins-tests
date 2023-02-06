import { renderHook, act } from '@testing-library/react';
import useThrottle from './useThrottle';

describe('useThrottle hook', () => {
    it('should execute the callback n times', () => {
        const mockFn = jest.fn();
        const executionCount = 4;
        const { result } = renderHook(() => useThrottle(mockFn));

        act(() => {
            for (let i = 0; i < executionCount; i += 1) {
                result.current();
            }
        });

        expect(mockFn).toHaveBeenCalledTimes(executionCount);
    });
});
