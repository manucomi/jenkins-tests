import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useSWR from 'swr';
import Checkbox from 'Components/Checkbox/Checkbox';
import Button from 'Components/Button/Button';
import FontIcon from 'Components/FontIcon/FontIcon';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import TextInput from 'Components/TextInput/TextInput';
import TextBox from 'Components/TextBox/TextBox';
import Alert from 'Components/Alert/Alert';
import Loader from 'Components/Loader/Loader';
import Modal from 'Components/Modal/Modal';
import ContentListService from 'Services/ContentListService/ContentListService';
import InteractionService from 'Services/InteractionService/InteractionService';
import DataLayer from 'Domains/DataLayer/DataLayer';
import noop from 'Helpers/noop/noop';
import styles from './SaveModal.module.scss';

let timerId;
function SaveModal({ onClose, dataPoints, userEmailAddress }) {
    const [checkedBoxes, setCheckedBoxes] = useState({});
    const [isNewList, setIsNewList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [isSaveError, setIsSaveError] = useState(false);
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);
    const [isDuplicateListError, setIsDuplicateListError] = useState(false);
    const [isListFormatError, setIsListFormatError] = useState(false);
    const [isListLengthError, setIsListLengthError] = useState(false);

    const { data: lists } = useSWR(
        ['/hbr/api/user/profile', userEmailAddress],
        ContentListService.getContentLists
    );

    const modalClasses = classNames({
        [styles.modal]: lists,
    });

    const isFormValid = () => {
        if (isNewList) {
            return (
                newListName &&
                !isDuplicateListError &&
                !isListFormatError &&
                !isListLengthError
            );
        }

        return true;
    };

    const onAlertClose = () => {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        onClose();
    };

    const handleSaveError = () => {
        setIsSaveError(true);
        timerId = setTimeout(() => onClose(), 2000);
    };

    const handleSuccess = () => {
        setIsSaveSuccess(true);
        const dataLayer = new DataLayer(window.digitalData);
        dataLayer.setCompletedSaveEvent(
            dataPoints.title,
            dataPoints.contentType
        );
        dataLayer.updateEvent();
        timerId = setTimeout(() => onClose(), 2000);
    };

    const handleListTitleChange = (event) => {
        const title = event.target.value;

        setIsDuplicateListError(lists.map((list) => list.name).includes(title));
        setIsListFormatError(
            !!title && !/^(?!\s*$)[a-zA-Z0-9\s]{1,30}$/.test(title)
        );
        setIsListLengthError(!title);

        setNewListName(title);
    };

    const handleSave = async () => {
        const addToLists = Object.entries(checkedBoxes)
            .filter(([, value]) => value)
            .map(([key]) => Number(key));
        const removeFromLists = Object.entries(lists)
            .map(([, value]) => {
                if (value.readOnly) {
                    return value;
                }

                return Number(value.id);
            })
            .filter((list) => !list.readOnly && !addToLists.includes(list));

        let newListID;

        if (newListName) {
            try {
                const response = await ContentListService.createContentList(
                    newListName,
                    newListDescription
                );
                addToLists.push((newListID = Number(response.id)));
            } catch (error) {
                handleSaveError();
            }
        }

        let saveID;

        if ((newListName && newListID) || !newListName) {
            try {
                const response = await InteractionService.save(dataPoints);
                saveID = Number(response.savedActivityId);
            } catch (error) {
                handleSaveError();
            }
        }

        if (saveID) {
            const promises = [];

            if (addToLists.length) {
                promises.push(
                    ContentListService.addItemToLists(saveID, addToLists)
                );
            }

            if (removeFromLists.length) {
                promises.push(
                    ContentListService.removeItemFromLists(
                        saveID,
                        removeFromLists
                    )
                );
            }

            try {
                await Promise.all(promises);
                handleSuccess();
            } catch (error) {
                handleSaveError();
            }
        }
    };

    const listTitleClasses = classNames({
        [styles['text-input']]: true,
        [styles.error]:
            isDuplicateListError || isListLengthError || isListFormatError,
    });

    useEffect(() => {
        const dataLayer = new DataLayer(window.digitalData);
        dataLayer.setInitiatedSaveEvent(
            dataPoints.title,
            dataPoints.contentType
        );
        dataLayer.updateEvent();
    }, [dataPoints.title, dataPoints.contentType]);

    return (
        <Modal
            onClose={onAlertClose}
            label="Save popular article to list"
            backdropClassName={styles.backdrop}
            modalClassName={modalClasses}
            isFocusTrapped={!!lists}
            isCentered
        >
            {!lists && <Loader />}
            {lists && !isSaveError && !isSaveSuccess && (
                <>
                    <div className={`${styles['top-bar']} ${styles.row}`}>
                        <p className={styles['top-bar-label']}>Save to:</p>
                        <Button
                            variant={Button.variants.TEXT}
                            onClick={onClose}
                            label="Close the save dialog"
                        >
                            <SVGIcon
                                className={styles['close-icon']}
                                variant={SVGIcon.variants.X}
                            />
                        </Button>
                    </div>
                    <form name="saveForm" autoComplete="off" noValidate>
                        <ul className={styles.list}>
                            <li className={styles['list-row']}>
                                <Checkbox
                                    label="My Library"
                                    isChecked
                                    onChange={noop}
                                    afterLabel
                                    disabled
                                    labelClassName={styles['list-label']}
                                    checkboxClassName={styles.checkbox}
                                />
                            </li>
                            {lists?.map(({ id, name, readOnly }) => {
                                if (readOnly) {
                                    return null;
                                }

                                return (
                                    <li key={id} className={styles['list-row']}>
                                        <Checkbox
                                            onChange={() =>
                                                setCheckedBoxes({
                                                    ...checkedBoxes,
                                                    [id]: !checkedBoxes[id],
                                                })
                                            }
                                            label={name}
                                            isChecked={!!checkedBoxes[id]}
                                            afterLabel
                                            labelClassName={
                                                styles['list-label']
                                            }
                                            checkboxClassName={styles.checkbox}
                                        />
                                    </li>
                                );
                            })}
                            {isNewList && (
                                <li className={styles['list-row-no-border']}>
                                    <Checkbox
                                        isChecked={isNewList}
                                        onChange={() => setIsNewList(false)}
                                        label="Create New Folder"
                                        afterLabel
                                        labelClassName={
                                            styles['new-list-label']
                                        }
                                        checkboxClassName={styles.checkbox}
                                        data-qa="save-new-list-checkbox"
                                    />
                                </li>
                            )}
                        </ul>
                        {!isNewList && (
                            <Button
                                variant={Button.variants.TEXT}
                                className={styles['new-list-btn']}
                                onClick={() => setIsNewList(true)}
                                data-qa="save-new-list-button"
                            >
                                Create New Folder{' '}
                                <FontIcon
                                    variant={FontIcon.variants.PLUS}
                                    className={styles['plus-icon']}
                                />
                            </Button>
                        )}
                        {isNewList && (
                            <>
                                <div className={styles.row}>
                                    <TextInput
                                        label="Folder Title"
                                        name="listName"
                                        variant={TextInput.variants.TEXT}
                                        placeholder="Enter Folder Name"
                                        onChange={handleListTitleChange}
                                        textInputClassName={listTitleClasses}
                                        labelClassName={styles.label}
                                        data-qa="save-new-list-title"
                                        required
                                    />
                                    <Alert
                                        active={isDuplicateListError}
                                        intrusive
                                    >
                                        <p
                                            className={
                                                styles['dup-folder-error']
                                            }
                                        >
                                            A folder with this title already
                                            exists.
                                        </p>
                                    </Alert>
                                    <Alert active={isListFormatError} intrusive>
                                        <p
                                            className={
                                                styles['dup-folder-error']
                                            }
                                        >
                                            Folder title must be 30 characters
                                            or less and consisting of English
                                            letters, numbers or spaces.
                                        </p>
                                    </Alert>
                                    <Alert active={isListLengthError} intrusive>
                                        <p
                                            className={
                                                styles['dup-folder-error']
                                            }
                                        >
                                            This field is required.
                                        </p>
                                    </Alert>
                                </div>
                                <div className={styles.row}>
                                    <TextBox
                                        label="Folder Description"
                                        name="listDescription"
                                        placeholder="Enter Folder Description"
                                        onChange={(event) =>
                                            setNewListDescription(
                                                event.target.value
                                            )
                                        }
                                        labelClassName={styles.label}
                                        textBoxClassName={styles['text-box']}
                                        data-qa="save-new-list-description"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <Button
                            variant={Button.variants.ALT}
                            className={styles['save-btn']}
                            disabled={!isFormValid()}
                            onClick={handleSave}
                            data-qa="save-submit-button"
                        >
                            Save
                        </Button>
                    </form>
                </>
            )}
            {(isSaveSuccess || isSaveError) && (
                <>
                    <div
                        className={`${styles.row} ${styles['final-notification-close-btn']}`}
                    >
                        <Button
                            variant={Button.variants.TEXT}
                            onClick={onAlertClose}
                            label="Close the save dialog"
                        >
                            <SVGIcon
                                className={styles['close-icon']}
                                variant={SVGIcon.variants.X}
                            />
                        </Button>
                    </div>
                    <Alert
                        className={`${styles.row} ${styles['final-notification']}`}
                        active={isSaveSuccess || isSaveError}
                    >
                        {isSaveSuccess && 'Saved!'}
                        {isSaveError && 'Saving failed!'}
                    </Alert>
                </>
            )}
        </Modal>
    );
}

SaveModal.propTypes = {
    dataPoints: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    userEmailAddress: PropTypes.string.isRequired,
};

export default SaveModal;
