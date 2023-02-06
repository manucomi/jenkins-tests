import useConfigStore from './configuration.store';

describe('Configuration store', () => {
    it('should correctly set the given object in the store', () => {
        expect(useConfigStore.getState().config).toEqual(
            useConfigStore.initialConfig
        );
        const testConfig = {
            attr1: {
                subAttr1: ['subAtrr1-el1'],
            },
            attr2: 'attr2',
        };

        useConfigStore.getState().setConfig('additionalProperty', testConfig);
        expect(
            useConfigStore.getState().config.additionalProperty
        ).toStrictEqual(testConfig);

        expect(useConfigStore.getState().config.apiOrigin).toBe('');
    });
});
