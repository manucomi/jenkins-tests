import React from 'react';
import PropTypes from 'prop-types';
import './FontHelper.scss';

const showLabel = (style) => {
    const weightVariants = {
        200: 'Thin 200',
        400: 'Light 400',
        500: 'Regular 500',
        600: 'Medium 600',
        700: 'Bold 700',
        800: 'Black 800',
        900: 'Black 900',
    };
    const { fontWeight, fontStyle } = style;

    return `${weightVariants[fontWeight]} ${fontStyle}`;
};

export default function FontHelper({
    weights,
    size,
    text,
    fontFamily,
    italic,
}) {
    const styles = [];
    weights.forEach((weight) => {
        styles.push({ fontWeight: weight, fontStyle: 'normal' });
        if (italic) styles.push({ fontWeight: weight, fontStyle: 'italic' });
    });

    return (
        <div className="container">
            {styles.map((style) => {
                return (
                    <div
                        className="row"
                        key={`${style.fontStyle}_${style.fontWeight}`}
                    >
                        <span className="font-label">{showLabel(style)}</span>
                        <span
                            style={{
                                ...style,
                                fontFamily,
                                fontSize: size,
                            }}
                        >
                            {text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

FontHelper.defaultProps = {
    italic: true,
};

FontHelper.propTypes = {
    size: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    weights: PropTypes.arrayOf(PropTypes.number).isRequired,
    italic: PropTypes.bool,
};
