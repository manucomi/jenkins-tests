import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

jest.mock('focus-trap-react');

describe('<Modal /> component', () => {
    it('should include custom modal classes', () => {
        const customClasses = 'centered modal';

        render(
            <Modal
                modalClassName={customClasses}
                label="test modal"
                onClose={() => {}}
            >
                <p>I am a modal</p>
            </Modal>
        );

        expect(screen.getByRole('dialog')).toHaveClass(customClasses);
    });

    it('should close modal on pressing escape key', async () => {
        const onClose = jest.fn();

        render(
            <Modal label="test modal" onClose={onClose}>
                <p>I am a modal</p>
            </Modal>
        );
        await userEvent.type(screen.getByRole('dialog'), '{escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when any key besides ESC is pressed', async () => {
        const onClose = jest.fn();

        render(
            <Modal label="test modal" onClose={onClose}>
                <p>I am a modal</p>
            </Modal>
        );
        await userEvent.type(screen.getByRole('dialog'), '{space}');
        expect(onClose).not.toHaveBeenCalled();
    });
});
