import { useEffect } from 'react';

/**
 * A React hook that triggers a handler when the clicked/touched element is not
 * the referenced element or a descendant of the referenced element.
 *
 * @param {object} ref - A React ref to the element you want to monitor for outside clicks.
 * @param {Function} handler - The handler to be executed.
 */
const useOnOutsideClick = (ref, handler) => {
    useEffect(() => {
        const handleClick = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return event;
            }

            return handler(event);
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [handler, ref]);
};

export default useOnOutsideClick;
