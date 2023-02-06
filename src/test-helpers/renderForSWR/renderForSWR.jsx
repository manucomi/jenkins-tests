import React from 'react';
import { SWRConfig } from 'swr';
import { render } from '@testing-library/react';

/**
 * This is a wrapper for the render method which uses <SWRConfig /> to
 * perform test specific configuration for SWR.
 *
 * @example
 * renderForSWR(<SomeComponent />);
 */
const renderForSWR = (ui, options) =>
    render(ui, {
        wrapper: function renderWrapper({ children }) {
            return (
                <SWRConfig
                    value={{ dedupingInterval: 0, provider: () => new Map() }}
                >
                    {children}
                </SWRConfig>
            );
        },
        ...options,
    });

export default renderForSWR;
