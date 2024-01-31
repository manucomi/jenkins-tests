import React from 'react';
import { render } from '@testing-library/react';
import NewRelicBrowserAgent, {
    NewRelicBrowserAgentTestIds,
} from './NewRelicBrowserAgent';

describe('New Relic Snipet component', () => {
    const { env } = process;
    const applicationIDTest = '1111111111';

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...env };
    });

    afterEach(() => {
        process.env = env;
    });

    it('should render the snippet', () => {
        process.env.NEW_RELIC_APPLICATION_ID = applicationIDTest;

        const { queryByTestId } = render(<NewRelicBrowserAgent />);
        expect(
            queryByTestId(NewRelicBrowserAgentTestIds.CONTAINER),
        ).toBeInTheDocument();
    });

    it('should not render the snippet', () => {
        process.env.NEW_RELIC_APPLICATION_ID = '';

        const { queryByTestId } = render(<NewRelicBrowserAgent />);
        expect(
            queryByTestId(NewRelicBrowserAgentTestIds.CONTAINER),
        ).not.toBeInTheDocument();
    });
});
