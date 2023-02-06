import React, { forwardRef, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'Components/Button/Button';
import SVGIcon from 'Components/SVGIcon/SVGIcon';
import TextInput from 'Components/TextInput/TextInput';
import useOnOutsideClick from 'Hooks/useOnOutsideClick/useOnOutsideClick';
import useThrottle from 'Hooks/useThrottle/useThrottle';
import styles from './SearchForm.module.scss';
import AutoSuggest from './AutoSuggest/AutoSuggest';

/**
 * The `SearchForm` contains the search form for use exclusively in the `MegaMenu`.
 *
 * @example
 * const searchFieldRef = useRef(null);
 * useEffect(() => {
 *     if (isVisible) {
 *         searchFieldRef.current?.focus();
 *     }
 * }, [isVisible, searchFieldRef]);
 * return <SearchForm className={styles.search} ref={searchFieldRef} />;
 */
const SearchForm = forwardRef(({ className }, searchFieldRef) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [autoSuggestTerm, setAutoSuggestTerm] = useState(searchTerm);
    const containerRef = useRef(null);

    useOnOutsideClick(containerRef, () => setAutoSuggestTerm(''));

    const throttledAutoSuggestUpdate = useThrottle(
        (term) => setAutoSuggestTerm(term),
        350,
        { leading: false }
    );

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        throttledAutoSuggestUpdate(event.target.value);
    };

    const handleClearClick = () => {
        setSearchTerm('');
        throttledAutoSuggestUpdate('');
        searchFieldRef.current?.focus();
    };

    const clearBtnClasses = classNames({
        [styles['btn-clear-search']]: true,
        [styles.hide]: searchTerm.length <= 0,
    });

    const searchFieldClasses = classNames({
        [styles['search-form']]: true,
        [className]: className,
    });

    return (
        <div ref={containerRef}>
            <form
                className={searchFieldClasses}
                role="search"
                action="/search"
                autoComplete="off"
            >
                <TextInput
                    label="Search hbr.org"
                    labelClassName={styles['search-field-label']}
                    name="term"
                    onChange={handleSearchTermChange}
                    placeholder="Search hbr.org"
                    ref={searchFieldRef}
                    textInputClassName={styles['search-field']}
                    value={searchTerm}
                    variant={TextInput.variants.SEARCH}
                />
                <Button
                    variant={Button.variants.TEXT}
                    className={clearBtnClasses}
                    onClick={handleClearClick}
                >
                    CLEAR
                </Button>
                <Button
                    variant={Button.variants.TEXT}
                    className={styles['btn-search']}
                    label="Search hbr.org"
                    submit
                >
                    <SVGIcon variant={SVGIcon.variants.SEARCH} />
                </Button>
            </form>
            <AutoSuggest searchTerm={autoSuggestTerm} />
        </div>
    );
});

SearchForm.displayName = 'SearchForm';

SearchForm.defaultProps = {
    className: '',
};

SearchForm.propTypes = {
    className: PropTypes.string,
};

export default SearchForm;
