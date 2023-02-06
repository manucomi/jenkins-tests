import HTTPError from 'Errors/HTTPError/HTTPError';
import UserService from './UserService';
import mockFetch from '../../test-helpers/mockFetch/mockFetch';

describe('UserService', () => {
    describe('#authenticate()', () => {
        const credentials = ['jerry.garcia@hbr.org', 'password'];

        it('should resolve and return the authentication status', () => {
            const mockResponse = { code: 200, status: 'authenticated' };
            window.fetch = mockFetch(200, mockResponse);

            return expect(
                UserService.authenticate(...credentials)
            ).resolves.toBe(mockResponse);
        });

        it('should reject/throw when authentication fails', () => {
            const mockResponse = { code: 400, errors: [] };
            window.fetch = mockFetch(400, mockResponse);

            return expect(
                UserService.authenticate(...credentials)
            ).rejects.toThrow(HTTPError);
        });
    });

    describe('#logout()', () => {
        it('should resolve and return the status of the request', () => {
            const mockResponse = { code: 200, status: 'logged out' };
            window.fetch = mockFetch(200, mockResponse);

            return expect(UserService.logout()).resolves.toBe(mockResponse);
        });

        it('should reject/throw when authentication fails', () => {
            window.fetch = mockFetch(500);

            return expect(UserService.logout()).rejects.toThrow(HTTPError);
        });
    });

    describe('#create()', () => {
        const mockFormData = [
            'Jerry',
            'Garcia',
            'jerry.garcia@hbr.org',
            'password',
        ];

        it('should resolve and return a user profile', () => {
            const mockUser = {
                id: 11,
                firstName: mockFormData[0],
                lastName: mockFormData[1],
            };
            window.fetch = mockFetch(200, mockUser);

            return expect(UserService.create(...mockFormData)).resolves.toBe(
                mockUser
            );
        });

        it('should reject/throw with data when the request fails', async () => {
            const mockError = { errorField: 'email', errorMessage: 'message' };
            window.fetch = mockFetch(400, {
                errors: [mockError],
            });

            let thrownError;

            try {
                await UserService.create(...mockFormData);
            } catch (error) {
                thrownError = error;
            }

            expect(thrownError.data).toBe(mockError);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(409);

            return expect(UserService.create(...mockFormData)).rejects.toThrow(
                HTTPError
            );
        });
    });

    describe('#getProfile()', () => {
        it('should resolve and return a user profile', () => {
            const mockUser = { id: 11, firstName: 'Jerry', lastName: 'Garcia' };
            window.fetch = mockFetch(200, mockUser);

            return expect(UserService.getProfile()).resolves.toBe(mockUser);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(401);

            return expect(UserService.getProfile()).rejects.toThrow(HTTPError);
        });

        it('should set the fetch parameters', () => {
            const mockBaseURL = 'https://hbr.org';
            const mockCookies = 'foo=bar;hello=world;';
            window.fetch = jest.fn().mockImplementation(mockFetch(200));
            UserService.getProfile({
                baseURL: mockBaseURL,
                cookies: mockCookies,
            });
            expect(window.fetch).toHaveBeenCalledWith(
                `${mockBaseURL}/hbr/api/user/profile`,
                expect.objectContaining({
                    headers: expect.objectContaining({ cookie: mockCookies }),
                })
            );
        });
    });

    describe('#getSubscription()', () => {
        it('should resolve and return subscription info', () => {
            const mockSubscription = { userId: 11 };
            window.fetch = mockFetch(200, mockSubscription);

            return expect(
                UserService.getSubscription('jerry.garcia@hbr.org')
            ).resolves.toBe(mockSubscription);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(404);

            return expect(
                UserService.getSubscription('jerry.garcia@hbr.org')
            ).rejects.toThrow(HTTPError);
        });
    });

    describe('#resetPassword()', () => {
        it('should resolve and return a response', () => {
            const mockStatus = 200;
            window.fetch = mockFetch(mockStatus);

            return expect(
                UserService.resetPassword('jerry.garcia@hbr.org')
            ).resolves.toStrictEqual({ statusCode: mockStatus });
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(404);

            return expect(
                UserService.resetPassword('jerry.garcia@hbr.org')
            ).rejects.toThrow(HTTPError);
        });
    });

    describe('#subscribeNewsletter()', () => {
        it('should resolve and return an updated profile object containing the newly subscribed newsletters', () => {
            const mockNewsletterSubs = {
                newsletters: [{ name: 'hbpManagementTipoftheDay' }],
            };
            window.fetch = mockFetch(200, mockNewsletterSubs);

            return expect(
                UserService.subscribeNewsletter(
                    'hbpManagementTipoftheDay',
                    'POST'
                )
            ).resolves.toStrictEqual(mockNewsletterSubs);
        });

        it('should reject/throw when the request fails', () => {
            window.fetch = mockFetch(404);

            return expect(
                UserService.subscribeNewsletter(
                    'hbpManagementTipoftheDay',
                    'POST'
                )
            ).rejects.toThrow(HTTPError);
        });
    });
});
