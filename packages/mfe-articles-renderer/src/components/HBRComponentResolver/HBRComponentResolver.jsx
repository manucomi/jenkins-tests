/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

// remove this and import real component variations for hbr-component
function HBRComponent() {
    return (
        <div style={{ border: '2px solid #c82502' }}>
            Package HBRComponent Rendered
        </div>
    );
}

const defaultVariations = {
    promo: HBRComponent,
    series: HBRComponent,
    newsletter: HBRComponent,
    'newsletter-tout': HBRComponent,
    'podcast-promo': HBRComponent,
    'author-info': HBRComponent,
    'reading-list': HBRComponent,
    'related-content': HBRComponent,
    'section-header': HBRComponent,
    // Add more variations as needed
};

function HBRComponentResolver(customVariations = {}) {
    const mergedVariations = { ...defaultVariations, ...customVariations };
    function ResolvedComponent(props) {
        const {
            type,
            name,
            ordinal,
            title,
            dek,
            'is-insight': isInsight,
            'cta-text': ctaText,
        } = props;
        const HBRComponentVariation = mergedVariations[type] || null;
        return <HBRComponentVariation {...props} />;
    }

    // Assigning a display name for debugging purposes
    ResolvedComponent.displayName = 'HBRComponentResolver';

    ResolvedComponent.defaultProps = {
        name: null,
        ordinal: null,
        title: null,
        dek: null,
        'is-insight': null,
        'cta-text': null,
    };

    ResolvedComponent.propTypes = {
        type: PropTypes.string.isRequired,
        name: PropTypes.string,
        ordinal: PropTypes.number,
        title: PropTypes.string,
        dek: PropTypes.string,
        'is-insight': PropTypes.string,
        'cta-text': PropTypes.string,
    };

    return ResolvedComponent;
}

export default HBRComponentResolver;
