/**
 * Creates a PropTypes validator that can be chained with isRequired.
 *
 * @param {Function} validator - The PropTypes custom validator.
 * @returns {Function} - The new validator function.
 */
const createChainableTypeCheck = (validator) => {
    const checkType = (isRequired, props, propName, componentName) => {
        if (props[propName] === undefined) {
            if (isRequired) {
                return new Error(
                    `Required \`${propName}\` was not specified in ` +
                        `\`${componentName}\`.`
                );
            }
            return null;
        }
        return validator(props, propName, componentName);
    };

    const chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
};

export default createChainableTypeCheck;
