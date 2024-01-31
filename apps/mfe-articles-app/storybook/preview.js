import '../src/scss/_fonts.scss';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';
import { adSlotDecorator } from '../story-helpers/__mocks__/AdSlotMock';
import 'mfe-core/css/styles.css';

// Initialize MSW
initialize({
    onUnhandledRequest: 'bypass',
});

const redirectResourcesURL = 'https://www.hbr.org';

const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        msw: {
            handlers: {
                redirect: rest.get('/resources/*', (req, res, ctx) => {
                    return res(
                        ctx.status(301),
                        ctx.set(
                            'Location',
                            `${redirectResourcesURL}${req.url.pathname}`,
                        ),
                    );
                }),
            },
        },
    },
};

export const decorators = [adSlotDecorator, mswDecorator];
export default preview;
