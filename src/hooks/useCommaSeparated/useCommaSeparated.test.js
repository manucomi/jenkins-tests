import { renderHook } from '@testing-library/react';
import commaSeparated from 'Utilities/commaSeparated';
import useCommaSeparated from './useCommaSeparated';

jest.mock('Utilities/commaSeparated', () => jest.fn());

beforeEach(() => {
    commaSeparated.mockReset();
});

describe('useCommaSeparated', () => {
    it('should call commaSeparated once with the default separator', () => {
        const list = [];
        const { rerender } = renderHook(() => useCommaSeparated(list));

        expect(commaSeparated).toHaveBeenCalledTimes(1);
        expect(commaSeparated).toHaveBeenCalledWith(list, 'and');

        rerender();
        expect(commaSeparated).toHaveBeenCalledTimes(1);
        expect(commaSeparated).toHaveBeenCalledWith(list, 'and');
    });

    it('should call commaSeparated once with a custom separator', () => {
        const list = ['Kathy'];
        const separator = 'or';

        renderHook(() => useCommaSeparated(list, separator));

        expect(commaSeparated).toHaveBeenCalledTimes(1);
        expect(commaSeparated).toHaveBeenCalledWith(list, separator);
    });
});
