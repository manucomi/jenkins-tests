import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import TextBox from './TextBox';

describe('<TextBox /> component', () => {
    it('should include custom classes on the textarea', () => {
        const customClasses = 'full-width centered';

        render(
            <TextBox
                textBoxClassName={customClasses}
                name="test"
                label="test"
            />
        );

        expect(screen.getByRole('textbox')).toHaveClass(customClasses);
    });

    it('should execute the change function', async () => {
        const input = '123';
        const changeHandler = jest.fn();
        render(<TextBox name="test" label="test" onChange={changeHandler} />);
        await userEvent.type(screen.getByRole('textbox'), input);
        expect(changeHandler).toHaveBeenCalledTimes(input.length);
    });
});
