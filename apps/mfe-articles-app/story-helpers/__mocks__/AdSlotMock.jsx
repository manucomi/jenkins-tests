import React from 'react';
import AdSlot from 'mfe-core/ui/AdSlot';

let mockImpl;

function AdSlotMock({ ...args }) {
    const { className, targets, size, path } = args;

    if (mockImpl) {
        return mockImpl;
    }
    return (
        <AdSlot
            className={className}
            targets={targets}
            size={size}
            path={path}
        />
    );
}

export function adSlotDecorator(story, { parameters }) {
    mockImpl = parameters?.custom?.mocks?.AdSlot?.impl ?? null;

    return story();
}

export default AdSlotMock;
