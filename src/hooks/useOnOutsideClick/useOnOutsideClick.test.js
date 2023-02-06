import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useOnOutsideClick from './useOnOutsideClick';

describe('useOnOutsideClick hook', () => {
    it('should fire the handler 1 time', async () => {
        const handler = jest.fn();
        const ref = { current: document.createElement('div') };
        renderHook(() => useOnOutsideClick(ref, handler));

        await userEvent.click(document.body);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not fire the handler', async () => {
        const handler = jest.fn();
        const ref = { current: document };
        renderHook(() => useOnOutsideClick(ref, handler));

        await userEvent.click(document.body);

        expect(handler).not.toHaveBeenCalled();
    });
});
