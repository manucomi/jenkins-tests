import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import noop from 'Helpers/noop/noop';
import AdSlot, { AdSlotTestIds } from './AdSlot';

const setTargeting = jest.fn();

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useId: jest.fn(),
}));

afterEach(() => {
    jest.resetAllMocks();
});

describe('<AdSlot /> component (loading from document head)', () => {
    beforeEach(() => {
        React.useId.mockImplementation(jest.requireActual('react').useId);
        window.googletag = {
            cmd: {
                push: (func) => func(),
            },
            defineSlot: () => {
                return {
                    addService: () => {
                        return { setTargeting };
                    },
                };
            },
            display: (id) => {
                const ad = document.createElement('div');
                const container = document.getElementById(id);
                container.appendChild(ad);
            },
            pubads: () => {
                return {
                    addEventListener: (eventName, handler) =>
                        handler({ slot: { getSlotElementId: () => 'testId' } }),
                    enableSingleRequest: noop,
                    removeEventListener: noop,
                };
            },
            enableServices: noop,
        };
    });

    it('should populate the ad container div', async () => {
        render(
            <AdSlot
                path="/34363400/HBR_970x90"
                size={[
                    [970, 90],
                    [728, 90],
                    [1940, 180],
                    [300, 50],
                    [320, 50],
                    [600, 100],
                ]}
                targets={{ position: '1', inventory: 'ATF' }}
            />
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId(AdSlotTestIds.AD)
            ).not.toBeEmptyDOMElement();
        });
    });

    it('should run setTargeting', () => {
        render(
            <AdSlot
                path="/34363400/HBR_970x90"
                size={[
                    [970, 90],
                    [728, 90],
                    [1940, 180],
                    [300, 50],
                    [320, 50],
                    [600, 100],
                ]}
                targets={{ position: '1', inventory: 'ATF' }}
            />
        );

        expect(setTargeting).toHaveBeenCalledTimes(1);
    });

    it('should execute onSlotRender handler', () => {
        React.useId.mockImplementation(() => 'testId');
        const renderHandler = jest.fn();
        render(
            <AdSlot
                size={[[970, 90]]}
                path="/some/path"
                onSlotRender={renderHandler}
            />
        );

        expect(renderHandler).toHaveBeenCalledTimes(1);
    });

    it('should not execute onSlotRender handler', () => {
        React.useId.mockImplementation(() => 'someId');
        const renderHandler = jest.fn();

        render(
            <AdSlot
                size={[[970, 90]]}
                path="/some/path"
                onSlotRender={renderHandler}
            />
        );

        expect(renderHandler).not.toHaveBeenCalled();
    });
});
