import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import noop from 'Helpers/noop/noop';
import Checkbox from './Checkbox';

describe('<Checkbox /> component', () => {
    it('should include custom classes', () => {
        const checkboxClasses = 'position-left';
        const labelClasses = 'red';

        render(
            <Checkbox
                checkboxClassName={checkboxClasses}
                labelClassName={labelClasses}
                isChecked
                onChange={noop}
                label="test"
            />
        );

        expect(screen.getByRole('checkbox')).toHaveClass(checkboxClasses);
        expect(screen.getByText(/test/i)).toHaveClass(labelClasses);
    });

    it('should execute the change handler on click', async () => {
        const changeHandler = jest.fn();
        render(
            <Checkbox label="test" isChecked={false} onChange={changeHandler} />
        );
        await userEvent.click(screen.getByRole('checkbox'));
        expect(changeHandler).toHaveBeenCalled();
    });

    it('should execute the change handler on enter key press', async () => {
        const changeHandler = jest.fn();
        render(
            <Checkbox label="test" isChecked={false} onChange={changeHandler} />
        );

        /**
         * User-event clicks on the element before triggering key events. Since
         * this is a checkbox, clicks trigger the change handler and we need
         * to account for that. One click triggers the change handler twice since
         * it's a click on the label and the checkbox.
         */
        const defaultTimes = 2;
        await userEvent.type(screen.getByRole('checkbox'), '{enter}');
        expect(changeHandler).toHaveBeenCalledTimes(defaultTimes + 1);
    });

    it('should execute the change handler on space key press', async () => {
        const changeHandler = jest.fn();
        render(
            <Checkbox label="test" isChecked={false} onChange={changeHandler} />
        );

        /**
         * User-event clicks on the element before triggering key events. Since
         * this is a checkbox, clicks trigger the change handler and we need
         * to account for that. One click triggers the change handler twice since
         * it's a click on the label and the checkbox.
         */
        const defaultTimes = 2;
        await userEvent.type(screen.getByRole('checkbox'), ' ');
        expect(changeHandler).toHaveBeenCalledTimes(defaultTimes + 1);
    });

    it('should not execute the change handler on unsupported enter key presses', async () => {
        const changeHandler = jest.fn();
        render(
            <Checkbox label="test" isChecked={false} onChange={changeHandler} />
        );

        /**
         * User-event clicks on the element before triggering key events. Since
         * this is a checkbox, clicks trigger the change handler and we need
         * to account for that. One click triggers the change handler twice since
         * it's a click on the label and the checkbox.
         */
        const defaultTimes = 2;
        await userEvent.type(screen.getByRole('checkbox'), 'hello');
        expect(changeHandler).toHaveBeenCalledTimes(defaultTimes);
    });

    it('should not call onChange handler if disabled prop is provided', async () => {
        const changeHandler = jest.fn();
        render(
            <Checkbox
                label="test"
                isChecked={false}
                onChange={changeHandler}
                disabled
            />
        );

        await userEvent.click(screen.getByRole('checkbox'));

        expect(changeHandler).not.toHaveBeenCalled();
    });
});
