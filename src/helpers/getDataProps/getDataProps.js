/**
 * This method filters out and returns data-* props.
 *
 * @param {object} props - The props to filter.
 * @returns {object} - The data props.
 */
const getDataProps = (props) => {
    return Object.fromEntries(
        Object.entries(props).filter(([propName]) =>
            propName.startsWith('data-')
        )
    );
};

export default getDataProps;
