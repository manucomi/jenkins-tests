import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';
import useConfigStore from 'Stores/configuration/configuration.store';
import sort from './helpers/storySorter';
import { adSlotDecorator } from '../story-helpers/__mocks__/AdSlotMock';

// Initialize MSW
initialize({
    onUnhandledRequest: 'bypass',
});

const MS_BASE_URL = useConfigStore.getState().config.apiOrigin;

const order = {
    components: {
        '*': {
            overview: null,
            playground: null,
            features: {
                default: null,
            },
        },
    },
    hooks: {
        '*': {
            overview: null,
        },
    },
    fonts: {
        '*': {
            'import fonts': null,
        },
    },
};

export const parameters = {
    options: {
        storySort: (story1, story2) => sort(order, story1, story2),
    },
    msw: {
        handlers: {
            user: [
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/login`,
                    (req, res, ctx) => {
                        return res(
                            ctx.status(400),
                            ctx.json({
                                status: 400,
                            })
                        );
                    }
                ),
                rest.get(
                    `${MS_BASE_URL}/hbr/api/user/profile`,
                    (req, res, ctx) => {
                        return res(
                            ctx.status(200),
                            ctx.json({
                                folders: [
                                    {
                                        id: '123',
                                        readOnly: false,
                                        name: 'Read Soon',
                                    },
                                    {
                                        id: '124',
                                        readOnly: false,
                                        name: 'Save For Later',
                                    },
                                    {
                                        id: '456',
                                        readOnly: true,
                                        name: 'hide me',
                                    },
                                ],
                            })
                        );
                    }
                ),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/register`,
                    (req, res, ctx) => {
                        return res(
                            ctx.status(400),
                            ctx.json({
                                status: 400,
                                errors: [
                                    {
                                        field: 'password',
                                        errorMessage: `password does not meet password policy. Passwords must meet the following criteria: must have at least one number, one lower case letter, one upper case letter, and one special character (@ ! # $ % ^ & + =), no spaces, and be at least 10 characters long.`,
                                    },
                                ],
                            })
                        );
                    }
                ),
                rest.post('/api/user/subscriber/search', (req, res, ctx) => {
                    return res(ctx.status(400));
                }),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/forgot-password`,
                    (req, res, ctx) => {
                        return res(ctx.status(200));
                    }
                ),
                rest.get('/logout', (req, res, ctx) => {
                    return res(
                        ctx.json({ code: 200, status: 'authenticated' })
                    );
                }),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/folder`,
                    (req, res, ctx) => {
                        return res(ctx.status(200), ctx.json({ id: 123 }));
                    }
                ),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/folders/items/bulk-save`,
                    (req, res, ctx) => {
                        return res(ctx.status(201), ctx.json([{ id: 123 }]));
                    }
                ),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/folders/items/bulk-delete`,
                    (req, res, ctx) => {
                        return res(ctx.status(204));
                    }
                ),
                rest.post(
                    `${MS_BASE_URL}/hbr/api/user/items`,
                    (req, res, ctx) => {
                        return res(
                            ctx.status(201),
                            ctx.json({ savedActivityId: '123' })
                        );
                    }
                ),
            ],
            cart: rest.get('/api/shopping-cart', (req, res, ctx) => {
                return res(
                    ctx.json({
                        cart: {
                            cart_amount: 33.95,
                            line_items: {
                                physical_items: [
                                    {
                                        url: '/',
                                        name: `HBR at 100: The Most Influential and Innovative Articles from Harvard Business Review's First Century`,
                                        quantity: 1,
                                        sale_price: 35.0,
                                    },
                                    {
                                        url: '/',
                                        name: 'Physical Item 2',
                                        quantity: 1,
                                        sale_price: 23.0,
                                    },
                                ],
                                digital_items: [
                                    {
                                        url: '/',
                                        name: 'Digital Item 1',
                                        quantity: 1,
                                        sale_price: 10.95,
                                    },
                                ],
                            },
                        },
                    })
                );
            }),
            captcha: rest.get('/api/recaptcha/enabled', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json({}));
            }),
            search: rest.get(
                '/service/search/auto-suggest',
                (req, res, ctx) => {
                    return res(
                        ctx.json({
                            records: [
                                {
                                    contentType: 'Book',
                                    title: 'Title 1',
                                    link: 'https://url-title1.com',
                                },
                                {
                                    contentType: 'Digital',
                                    title: 'Title 2',
                                    link: 'https://url-title2.com',
                                },
                            ],
                            subjects: [
                                {
                                    title: 'Leadership',
                                    link: '?nf3q435',
                                },
                            ],
                        })
                    );
                }
            ),
        },
    },
};

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator, adSlotDecorator];
