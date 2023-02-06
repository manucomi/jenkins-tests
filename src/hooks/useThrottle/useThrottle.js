import { useRef } from 'react';
import throttle from 'lodash/throttle';

/**
 * A React hook that wraps lodash's throttle utility.
 *
 * See the lodash/throttle documentation for more details: https://lodash.com/docs/4.17.15#throttle.
 *
 * @param {Function} callback - The function to throttle.
 * @param {number} [delay=0] - The amount of time, in milliseconds, to throttle invocations.
 * @param {object} options - Options passed to lodash/throttle.
 * @returns {Function} - The throttled function.
 */
const useThrottle = (callback, delay = 0, options = {}) => {
    const throttled = useRef(throttle(callback, delay, options)).current;
    return throttled;
};

export default useThrottle;
