import { useMemo } from 'react';
import useConfigStore from 'Stores/configuration/configuration.store';

/**
 * A hook that returns a setter for each of the properties defined in the
 * configStore's initial configuration.
 *
 * @example
 *
 * // Let's say we have the following config in `configuration.store.js`
 * const initialConfig = {
 *  fieldOne: '',
 *  fieldTwo: {},
 *  fieldThree: 0
 * }
 *
 * // We get this
 * const { setFieldOne, setFieldTwo, setFieldThree } = useConfig();
 * setFieldOne('newValue')
 */

export default () => {
    const { initialConfig } = useConfigStore;

    return useMemo(() => {
        return Object.entries(initialConfig).reduce((setters, [key]) => {
            return {
                ...setters,
                [`set${key.charAt(0).toUpperCase() + key.slice(1)}`]: (
                    newVal
                ) => useConfigStore.getState().setConfig(key, newVal),
            };
        }, {});
    }, [initialConfig]);
};
