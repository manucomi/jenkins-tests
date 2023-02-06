import { useMemo, useState } from 'react';

/**
 * Creates a complex state from an initial state object,
 * and turns each key into an individual value and setter for optimized and safe updates.
 *
 * Works great in conjunction with useContext to create a shared state.
 *
 * @example
 * ```
 * const MyComponent = () => {
 *   const { name, setName, location, setLocation, isDeveloper, setIsDeveloper } = useCreateStore({
 *     name: 'Ben',
 *     location: 'ND',
 *     isDeveloper: true
 *   })
 *
 *   return //...
 * }
 */
export default (initialState) => {
    // internally, this manages a single useState
    const [state, setState] = useState(initialState);

    // generates setters based on the initial values
    const setters = useMemo(() => {
        // eslint-disable-next-line no-shadow
        return Object.entries(initialState).reduce((setters, [key]) => {
            // prepends "set" and capitalizes the initial letter of the property to create the setter
            // eslint-disable-next-line no-param-reassign
            setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = (
                value
            ) => {
                // when a setter is called, it intelligently updates only that part of the state
                setState((currentState) => ({
                    ...currentState,
                    [key]: value,
                }));
            };

            return setters;
        }, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // returns all values and setters
    return useMemo(
        () => ({
            ...state,
            ...setters,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state]
    );
};
