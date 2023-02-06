import { useMemo } from 'react';
import commaSeparated from 'Utilities/commaSeparated';

export default (arr, finalSeparator = 'and') => {
    return useMemo(
        () => commaSeparated(arr, finalSeparator),
        [arr, finalSeparator]
    );
};
