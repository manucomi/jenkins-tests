import createChainableTypeCheck from './createChainableTypeCheck';

describe('createChainableTypeCkeck service', () => {
    const props = { level: '2' };
    const propName = 'foo';
    const componentName = 'bar';
    const myFunc = () => true;
    const headingLevel = createChainableTypeCheck(myFunc);
    it('should return an Error when prop isRequired but missing', () => {
        expect(
            headingLevel.isRequired(props, propName, componentName)
        ).toBeInstanceOf(Error);
    });
    it('should return null when prop is missing but not required', () => {
        expect(headingLevel(props, propName, componentName)).toBe(null);
    });
});
