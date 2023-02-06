import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';

describe('<TextInput /> component', () => {
    it('should include custom classes', () => {
        const customClasses = 'full-width centered';

        render(
            <TextInput
                textInputClassName={customClasses}
                variant={TextInput.variants.TEXT}
                name="test"
                label="test"
            />
        );

        expect(screen.getByRole('textbox')).toHaveClass(customClasses);
    });

    it('should execute the change function', async () => {
        const inputLabel = 'test';
        const textInput = '123';
        const changeHandler = jest.fn();
        render(
            <TextInput
                name="test"
                variant={TextInput.variants.EMAIL}
                label={inputLabel}
                onChange={changeHandler}
            />
        );
        await userEvent.type(screen.getByRole('textbox'), textInput);
        expect(changeHandler).toHaveBeenCalledTimes(textInput.length);
    });

    it('should be readonly when input has a value', async () => {
        const inputLabel = 'test';
        const textValue = '123';
        render(
            <TextInput
                name="test"
                variant={TextInput.variants.TEXT}
                label={inputLabel}
                value={textValue}
            />
        );
        await userEvent.type(screen.getByRole('textbox'), 'some text');
        expect(screen.getByRole('textbox')).toHaveValue(textValue);
    });
    it('should have readonly attribute when disabled prop is true', () => {
        const inputLabel = 'test';
        const isDisabled = true;
        render(
            <TextInput
                name="test"
                variant={TextInput.variants.TEXT}
                label={inputLabel}
                disabled={isDisabled}
            />
        );
        expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
});
