import React from 'react';
import PropTypes from 'prop-types';
import ModalComponent from '../../src/components/Modal/Modal';

export default function Modal(props) {
    const {
        children,
        label,
        onClose,
        backdropClassName,
        modalClassName,
        isFocusTrapped,
        isCentered,
        container,
    } = props;
    return (
        <ModalComponent
            label={label}
            onClose={onClose}
            backdropClassName={backdropClassName}
            modalClassName={modalClassName}
            isFocusTrapped={isFocusTrapped}
            isCentered={isCentered}
            container={container}
        >
            {children}
        </ModalComponent>
    );
}

Modal.defaultProps = {
    backdropClassName: '',
    modalClassName: '',
    isFocusTrapped: true,
    isCentered: false,
    container: 'div#root',
};

Modal.propTypes = {
    backdropClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    modalClassName: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    isFocusTrapped: PropTypes.bool,
    isCentered: PropTypes.bool,
    container: PropTypes.string,
};
