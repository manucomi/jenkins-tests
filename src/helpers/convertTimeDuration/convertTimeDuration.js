/**
 * Converts time in seconds to minutes (if greater than 60) and hours (if greater than 3600).
 *
 * @param {number} timeInSeconds - Time input.
 * @returns {string} - The converted value.
 */
const convertTimeDuration = (timeInSeconds) => {
    const seconds =
        typeof timeInSeconds === 'string'
            ? +timeInSeconds.replace(/\D/g, '')
            : timeInSeconds;

    const SECONDS_IN_ONE_MIN = 60;
    const SECONDS_IN_ONE_HOUR = 3600;

    if (typeof seconds !== 'number' || seconds < 0)
        return 'Time should be a number';

    if (SECONDS_IN_ONE_MIN <= seconds && seconds < SECONDS_IN_ONE_HOUR) {
        return `${Math.round(seconds / SECONDS_IN_ONE_MIN)} mins`;
    }

    if (seconds >= SECONDS_IN_ONE_HOUR)
        return `${Math.round(seconds / SECONDS_IN_ONE_HOUR)} hrs`;

    return `${seconds} secs`;
};

export default convertTimeDuration;
