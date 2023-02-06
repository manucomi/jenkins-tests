import convertTimeDuration from './convertTimeDuration';

describe('convertTimeDuration given input in seconds', () => {
    it('Should return error message if input is not a number greater than 0', () => {
        const badInputs = [-1, {}, undefined, null];

        badInputs.forEach((badInput) => {
            const badInputMessage = 'Time should be a number';
            const response = convertTimeDuration(badInput);

            expect(response).toBe(badInputMessage);
        });
    });

    it('Should return time rounded in minutes if input is equal/greater than 60 and less than 3600', () => {
        expect(convertTimeDuration('60s')).toBe('1 mins');
        expect(convertTimeDuration('610s')).toBe('10 mins');
        expect(convertTimeDuration('3600s')).not.toBe('60 mins');
    });

    it('Should return time rounded in hours if input is equal/greater than 3600', () => {
        expect(convertTimeDuration('3600s')).toBe('1 hrs');
        expect(convertTimeDuration('5440s')).toBe('2 hrs');
    });

    it('Should return time in seconds if input is less than 60', () => {
        expect(convertTimeDuration('59s')).toBe('59 secs');
    });
});
