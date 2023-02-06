import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import Anchor from 'Components/Anchor/Anchor';
import SearchService from 'Services/SearchService/SearchService';
import useMegaMenuStore from '../../MegaMenu.store';
import styles from './AutoSuggest.module.scss';

/**
 * The `AutoSuggest` component fetches search suggestions based on the search
 * term and displays them. This is used exclusively in the `SearchForm`.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const handleChange = (event) => setSearchTerm(event.target.value);
 * return (
 *     <>
 *         <input type="text" onChange={handleChange} />
 *         <AutoSuggest searchTerm={searchTerm} />
 *     </>
 * );
 */
function AutoSuggest({ searchTerm }) {
    const { data } = useSWR(
        searchTerm && searchTerm.length >= 3 ? searchTerm : null,
        SearchService.getSuggestions
    );
    const suggestions = useMemo(() => data?.records?.slice(0, 6) || [], [data]);
    const setIsAutoSuggestOpen = useMegaMenuStore(
        (state) => state.setIsAutoSuggestOpen
    );

    useEffect(
        () => setIsAutoSuggestOpen(!!suggestions?.length),
        [setIsAutoSuggestOpen, suggestions]
    );

    const bringAttentionToWord = (stringContainingWord, word) => {
        const indexOfWord = stringContainingWord
            .toUpperCase()
            .indexOf(word.toUpperCase());
        const indexOfWordEnd = indexOfWord + word.length;

        if (indexOfWord === -1) {
            return stringContainingWord;
        }

        return (
            <>
                {stringContainingWord.substring(0, indexOfWord)}
                <b className={styles['search-term']}>
                    {stringContainingWord.substring(
                        indexOfWord,
                        indexOfWordEnd
                    )}
                </b>
                {stringContainingWord.substring(indexOfWordEnd)}
            </>
        );
    };

    if (suggestions?.length) {
        return (
            <div className={styles['auto-suggest']}>
                <ul className={styles.list}>
                    {suggestions.map(({ contentType, title, link }) => (
                        <li
                            key={`${title}:${link}`}
                            className={styles.suggestion}
                        >
                            <Anchor href={link} className={styles.link}>
                                {bringAttentionToWord(title, searchTerm)}{' '}
                                <span className={styles['content-type']}>
                                    {contentType.toLowerCase()}
                                </span>
                            </Anchor>
                        </li>
                    ))}
                </ul>
                {!!data.subjects.length && (
                    <>
                        <p className={styles['topics-title']}>
                            SUGGESTED TOPICS
                        </p>
                        <ul className={styles.topics}>
                            {data.subjects.map(({ title, link }) => (
                                <li
                                    className={styles.suggestion}
                                    key={`${title}:${link}`}
                                >
                                    <Anchor
                                        href={`/search${link}`}
                                        className={styles.link}
                                    >
                                        {bringAttentionToWord(
                                            title,
                                            searchTerm
                                        )}
                                    </Anchor>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    }

    return null;
}

AutoSuggest.propTypes = {
    searchTerm: PropTypes.string.isRequired,
};

export default AutoSuggest;
