import DataLayerService from 'Services/DataLayerService/DataLayerService';
import MobileDetect from 'mobile-detect';
import DataLayer from './DataLayer';

jest.mock('mobile-detect');
jest.mock('Services/DataLayerService/DataLayerService');

beforeEach(() => {
    DataLayerService.mockReset();
});

describe('DataLayer', () => {
    beforeEach(() => {
        window.digitalData = undefined;
    });

    describe('#digitalData()', () => {
        it('should return the #digitalData member', () => {
            const mockData = { foo: 1, bar: [{ x: 'hello', y: 'world!' }] };
            const dataLayer = new DataLayer(mockData);
            expect(dataLayer.digitalData).toStrictEqual(mockData);
        });
    });

    describe('#setOnsiteSearchResults()', () => {
        it('should set the total number of search results', () => {
            const mockTotal = 2781;

            let dataLayer = new DataLayer();
            dataLayer.setOnsiteSearchResults(mockTotal);
            expect(
                dataLayer.digitalData.page.pageInfo.onsiteSearchResults
            ).toBe(mockTotal);

            dataLayer = new DataLayer({ page: {} });
            dataLayer.setOnsiteSearchResults(mockTotal);
            expect(
                dataLayer.digitalData.page.pageInfo.onsiteSearchResults
            ).toBe(mockTotal);
        });
    });

    describe('#setRegistrationEvent()', () => {
        it('should set the registration event', () => {
            const dataLayer = new DataLayer();
            dataLayer.setRegistrationEvent();
            expect(dataLayer.digitalData.event.length).toBe(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.any(Object),
            });
        });
    });

    describe('#setSignInEvent()', () => {
        it('should set the sign in event', () => {
            const dataLayer = new DataLayer();
            dataLayer.setSignInEvent();
            expect(dataLayer.digitalData.event.length).toBe(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.any(Object),
            });
        });
    });

    describe('#setCompletedSaveEvent()', () => {
        it('should set the interaction event', () => {
            const mockTitle = 'Foo Bar!';
            const mockType = 'Digital';
            const dataLayer = new DataLayer();
            dataLayer.setCompletedSaveEvent(mockTitle, mockType);
            expect(dataLayer.digitalData.event.length).toBe(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    contentName: mockTitle,
                    contentType: mockType,
                }),
            });
        });
    });

    describe('#setInitiatedSaveEvent()', () => {
        it('should set the interaction event', () => {
            const mockTitle = 'Foo Bar!';
            const mockType = 'Digital';
            const dataLayer = new DataLayer();
            dataLayer.setInitiatedSaveEvent(mockTitle, mockType);
            expect(dataLayer.digitalData.event.length).toBe(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    contentName: mockTitle,
                    contentType: mockType,
                }),
            });
        });
    });

    describe('#setCompletedShareEvent()', () => {
        it('should set the interaction event', () => {
            const mockTitle = 'Foo Bar!';
            const mockType = 'Digital';
            const mockShareType = 'Twitter';
            const dataLayer = new DataLayer();
            dataLayer.setCompletedShareEvent(
                mockTitle,
                mockType,
                mockShareType
            );
            expect(dataLayer.digitalData.event.length).toBe(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    contentName: mockTitle,
                    contentType: mockType,
                    shareMedium: mockShareType,
                }),
            });
        });
    });

    describe('#setInitiatedShareEvent()', () => {
        it('should set the interaction event', () => {
            const mockTitle = 'Foo Bar!';
            const mockType = 'Digital';
            const dataLayer = new DataLayer();
            dataLayer.setInitiatedShareEvent(mockTitle, mockType);
            expect(dataLayer.digitalData.event.length).toEqual(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    contentName: mockTitle,
                    contentType: mockType,
                }),
            });
        });
    });

    describe('#setNewsletterSubscribeEvent()', () => {
        it('set the subscribe event with the correct newsletter name', () => {
            const mockNewsletterName = 'mockNewsletter';
            const dataLayer = new DataLayer();
            dataLayer.setNewsletterSubscribeEvent(mockNewsletterName);
            expect(dataLayer.digitalData.event.length).toEqual(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    newsletterName: mockNewsletterName,
                }),
            });
        });
    });

    describe('#setNewsletterUnubscribeEvent()', () => {
        it('set the unsubscribe event with the correct newsletter name', () => {
            const mockNewsletterName = 'mockNewsletter';
            const dataLayer = new DataLayer();
            dataLayer.setNewsletterUnsubscribeEvent(mockNewsletterName);
            expect(dataLayer.digitalData.event.length).toEqual(1);
            expect(dataLayer.digitalData.event[0]).toStrictEqual({
                eventInfo: expect.objectContaining({
                    newsletterName: mockNewsletterName,
                }),
            });
        });
    });

    describe('#updateEvent()', () => {
        it('should update `window.digitalData.event`', () => {
            const mockEvent = { eventInfo: { foo: 'bar' } };
            const dataLayer = new DataLayer({ event: [mockEvent] });
            dataLayer.updateEvent();
            expect(window.digitalData.event.length).toBe(1);
            expect(window.digitalData.event[0]).toStrictEqual(mockEvent);
        });

        it('should update `window.digitalData.event` to an empty array', () => {
            window.digitalData = {};
            const dataLayer = new DataLayer();
            dataLayer.updateEvent();
            expect(window.digitalData.event.length).toBe(0);
        });
    });

    describe('#updateUsers()', () => {
        it('should update `window.digitalData.users`', () => {
            const mockUser = { id: 28, firstName: 'Mock', lastName: 'User' };
            const dataLayer = new DataLayer({ users: [mockUser] });
            dataLayer.updateUsers();
            expect(window.digitalData.users.length).toBe(1);
            expect(window.digitalData.users[0]).toStrictEqual(mockUser);
        });

        it('should update `window.digitalData.users` to an empty array', () => {
            window.digitalData = {};
            const dataLayer = new DataLayer();
            dataLayer.updateUsers();
            expect(window.digitalData.users.length).toBe(0);
        });
    });

    describe('#init()', () => {
        it('should fetch using the `serverOptions`', () => {
            MobileDetect.mockImplementationOnce(() => {
                return { phone: () => true };
            });
            DataLayerService.getDigitaldata.mockImplementationOnce(() => {
                return {
                    users: [{ profile: { daysSinceLastVisit: 5 } }],
                };
            });

            const mockBaseURL = 'https://hbr.org';
            const mockRequest = {
                headers: {
                    cookie: 'foo=bar;hello=world;',
                    host: mockBaseURL,
                    referer: 'https://hbr.org/referer',
                    'user-agent': 'mock/agent',
                },
                path: '/foo/bar',
                protocol: 'https',
            };
            const serverOptions = {
                baseURL: mockBaseURL,
                request: mockRequest,
            };
            const dataLayer = new DataLayer();
            dataLayer.init(serverOptions);
            expect(DataLayerService.getDigitaldata).toHaveBeenCalledWith(
                serverOptions
            );
        });

        it('should initialize the `digitalData` member', async () => {
            MobileDetect.mockImplementationOnce(() => {
                return { phone: () => false, tablet: () => true };
            });
            DataLayerService.getDigitaldata.mockImplementationOnce(() => {
                return {
                    users: [{ profile: { daysSinceLastVisit: 0 } }],
                };
            });
            const dataLayer = new DataLayer();
            await dataLayer.init();
            expect(dataLayer.digitalData.users.length).toBe(1);
            expect(dataLayer.digitalData.users[0]).toEqual(expect.any(Object));
            expect(dataLayer.digitalData.page.pageInfo).toEqual(
                expect.any(Object)
            );
        });

        it('should not initialize `digitalData.users`', async () => {
            DataLayerService.getDigitaldata.mockImplementationOnce(() =>
                Promise.reject()
            );
            const dataLayer = new DataLayer();
            await dataLayer.init();
            expect(dataLayer.digitalData.users).toBeUndefined();
        });
    });
});
