import getDataProps from './getDataProps';

describe('getDataProps helper', () => {
    it('should only return data-* props', () => {
        const mockDataProps = {
            'data-prop-1': 'more stuff',
            'data-prop-2': 'the last stuff',
        };
        const mockProps = { 'unknown-prop': 'stuff', ...mockDataProps };
        expect(getDataProps(mockProps)).toStrictEqual(mockDataProps);
    });

    it('should not return any props', () => {
        const mockProps = {
            foo: 'bar',
            x: 'y',
            to: 'the moon',
        };
        expect(getDataProps(mockProps)).toStrictEqual({});
    });
});
