import { renderHook } from '@testing-library/react';
import useConfigStore from 'Stores/configuration/configuration.store';
import useConfig from './useConfig';

describe('useConfig', () => {
    it('should correctly return a setter', () => {
        const { result } = renderHook(() => useConfig());

        result.current.setApiOrigin('https://otherorigin.com');

        expect(useConfigStore.getState().config).toStrictEqual({
            apiOrigin: 'https://otherorigin.com',
        });
    });
});
