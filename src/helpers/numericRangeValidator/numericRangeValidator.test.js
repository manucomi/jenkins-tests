import numericRangeValidator from './numericRangeValidator';

describe('numeric range validator', () => {
    it('should return undefined when the correct value is passed as prop', () => {
        expect(
            numericRangeValidator(0, 2)({ level: 0 }, 'level', 'MyComponent')
        ).toBeUndefined();
        expect(
            numericRangeValidator(1, 2)({ level: 1 }, 'level', 'MyComponent')
        ).toBeUndefined();
    });
    it('should return appropriate error object when prop is not a number', () => {
        const props = { level: 'foo' };
        const response = numericRangeValidator(1, 2)(
            props,
            'level',
            'MyComponent'
        );
        expect(response?.message).toBe(
            `\`MyComponent\` only accepts number type for level prop`
        );
    });
    it('should return appropriate error object when prop is out of range', () => {
        const props = { level: 7 };
        const response = numericRangeValidator(1, 3)(
            props,
            'level',
            'MyComponent'
        );
        expect(response?.message).toBe(
            `\`MyComponent\` only accepts number values 1-3 for level prop`
        );
    });
    it('should return null when prop is not present', () => {
        const props = { abc: 1 };
        const response = numericRangeValidator(1, 3)(
            props,
            'level',
            'MyComponent'
        );
        expect(response).toBeNull();
    });
});
