import commaSeparated from './commaSeparated';

describe('commaSeparated', () => {
    it('should return an empty string for an empty array', () => {
        expect(commaSeparated([])).toEqual('');
    });

    it('should return a single element for an array with one element', () => {
        expect(commaSeparated(['Kathy'])).toEqual('Kathy');
        expect(commaSeparated(['Kathy'], 'or')).toEqual('Kathy');
    });

    it('should separate two elements with the final separator', () => {
        expect(commaSeparated(['Kathy', 'James'], 'or')).toEqual(
            'Kathy or James'
        );
    });

    it('should separate three or more elements with commas and the final separator', () => {
        expect(commaSeparated(['Kathy', 'James', 'Sharon'])).toEqual(
            'Kathy, James, and Sharon'
        );
        expect(
            commaSeparated(['Kathy', 'James', 'Sharon', 'Doug'], 'or')
        ).toEqual('Kathy, James, Sharon, or Doug');
    });
});
