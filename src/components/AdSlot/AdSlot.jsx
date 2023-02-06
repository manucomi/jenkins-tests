import React, { useEffect, useId } from 'react';
import PropTypes from 'prop-types';

const TestIds = {
    AD: 'ad',
};

function AdSlot({ path, size, targets, className, onSlotRender }) {
    const adUnitId = useId();

    useEffect(() => {
        const googletag = window.googletag || {};

        googletag.cmd = googletag.cmd || [];

        const targetEntries = Object.entries(targets);
        const renderEventHandler = (event) => {
            if (event.slot.getSlotElementId() === adUnitId) {
                onSlotRender(event);
            }
        };

        googletag.cmd.push(() => {
            targetEntries.reduce((accumulator, [key, value]) => {
                return accumulator
                    ? accumulator.setTargeting(key, value)
                    : null;
            }, googletag.defineSlot(path, size, adUnitId)?.addService(googletag.pubads()));

            if (onSlotRender) {
                googletag
                    .pubads()
                    .addEventListener('slotRenderEnded', renderEventHandler);
            }

            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
            googletag.display(adUnitId);
        });

        return () => {
            if (onSlotRender) {
                googletag.cmd.push(() => {
                    googletag
                        .pubads()
                        .removeEventListener(
                            'slotRenderEnded',
                            renderEventHandler
                        );
                });
            }
        };
    }, [adUnitId, path, size, targets, onSlotRender]);

    return <div data-testid={TestIds.AD} id={adUnitId} className={className} />;
}

AdSlot.defaultProps = {
    className: '',
    onSlotRender: null,
    targets: {},
};

AdSlot.propTypes = {
    className: PropTypes.string,
    targets: PropTypes.objectOf(PropTypes.string),
    size: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    path: PropTypes.string.isRequired,
    onSlotRender: PropTypes.func,
};

export default AdSlot;
export { TestIds as AdSlotTestIds };
