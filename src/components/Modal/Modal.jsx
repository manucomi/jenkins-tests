import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import useOnOutsideClick from 'Hooks/useOnOutsideClick/useOnOutsideClick';
import styles from './Modal.module.scss';

function Modal({
    children,
    label,
    onClose,
    backdropClassName,
    modalClassName,
    isFocusTrapped,
    isCentered,
    container,
}) {
    const modalRef = useRef(null);

    const modalClasses = classNames({
        [styles.modal]: true,
        [modalClassName]: true,
    });

    const backdropClasses = classNames({
        [styles.backdrop]: true,
        [backdropClassName]: true,
        [styles.center]: isCentered,
    });

    useOnOutsideClick(modalRef, onClose);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const modal = (
        <div className={styles.container}>
            <div className={backdropClasses}>
                <FocusTrap active={isFocusTrapped}>
                    <div
                        role="dialog"
                        aria-label={label}
                        className={modalClasses}
                        ref={modalRef}
                        id="modal-role"
                    >
                        {children}
                    </div>
                </FocusTrap>
            </div>
        </div>
    );

    return createPortal(modal, document.querySelector(container));
}

Modal.defaultProps = {
    backdropClassName: '',
    modalClassName: '',
    isFocusTrapped: true,
    isCentered: false,
    container: 'body',
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

export default Modal;
