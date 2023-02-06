// Disabling rule until discuss how to manage helpers exports, SB don`t recognize this import without .js extension
// eslint-disable-next-line import/extensions
import createChainableTypeCheck from '../createChainableTypeCheck/createChainableTypeCheck.js';

/**
 * Determines if a prop passed is numeric and within range.
 *
 * @param {number} minVal - The minimum allowed value of passed prop.
 * @param {number} maxVal - The maximum allowed value for passed prop.
 * @returns {Function} - The new validator chained type function.
 */
const numericRangeValidator = (minVal, maxVal) => {
    const validator = (props, propName, componentName) => {
        let error;
        const propValue = props?.[propName];

        if (typeof propValue !== 'number') {
            error = new Error(
                `\`${componentName}\` only accepts number type for ${propName} prop`
            );
        } else if (!(propValue >= minVal && propValue <= maxVal)) {
            error = new Error(
                `\`${componentName}\` only accepts number values ${minVal}-${maxVal} for ${propName} prop`
            );
        }

        return error;
    };
    return createChainableTypeCheck(validator);
};

export default numericRangeValidator;
