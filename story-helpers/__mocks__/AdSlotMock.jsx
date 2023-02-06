import React from 'react';
import AdSlot from '../../src/components/AdSlot/AdSlot';

let mockImpl;
// eslint-disable-next-line react/prop-types
function AdSlotMock({ ...args }) {
    const { className, targets, size, path, onSlotRender } = args;
    if (mockImpl) {
        return mockImpl;
    }
    return (
        <AdSlot
            className={className}
            targets={targets}
            size={size}
            path={path}
            onSlotRender={onSlotRender}
        />
    );
}

export function adSlotDecorator(story, { parameters }) {
    if (parameters && parameters?.custom?.mocks?.AdSlot.impl) {
        mockImpl = parameters.custom.mocks.AdSlot.impl;
    } else mockImpl = null;
    return story();
}

export default AdSlotMock;
