import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

function AdConsentModal({ show, onAccept, onReject }) {
    return show ? (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Harvard Bussines Review asks for your consent</h3>
                <div className="content">
                    <p>
                        Funding Choices is domain restricted for *.hbr.org.
                        Users who meet the requirements will be presented with a
                        modal that allows them to provide consent for various
                        privacy options.
                    </p>
                    <br />
                    Do you Consent?
                </div>
                <div className="actions">
                    <button
                        className="toggle-button"
                        onClick={onReject}
                        type="button"
                    >
                        Reject
                    </button>
                    <button
                        className="toggle-button"
                        onClick={onAccept}
                        type="button"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

AdConsentModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onAccept: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
};

export default AdConsentModal;
