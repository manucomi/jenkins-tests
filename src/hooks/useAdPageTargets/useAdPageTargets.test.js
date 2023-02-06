import { renderHook } from '@testing-library/react';
import cookieCutter from 'cookie-cutter';
import MobileDetect from 'mobile-detect';
import useAdPageTargets from './useAdPageTargets';

jest.mock('mobile-detect');
jest.mock('cookie-cutter');

let mockProfile;

beforeEach(() => {
    mockProfile = {
        industry: '',
        jobTitle: '',
        newsletters: [],
        status: 'registered',
        topics: [],
    };
});

const setTargeting = jest.fn();

beforeEach(() => {
    window.googletag = {
        cmd: { push: (func) => func() },
        pubads: jest.fn().mockImplementation(() => ({ setTargeting })),
    };
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('useAdPageTargets hook', () => {
    it('should not call setTargeting with an `industry` key', () => {
        const { rerender } = renderHook(() =>
            useAdPageTargets(undefined, mockProfile)
        );
        expect(setTargeting.mock.calls[1][0]).toBe('industry');
        setTargeting.mockClear();
        mockProfile = null;
        rerender();
        expect(setTargeting.mock.calls[1][0]).not.toBe('industry');
    });

    it('should call setTargeting with a `layout` value of `mobile`', () => {
        MobileDetect.mockImplementationOnce(() => {
            return { mobile: () => true };
        });
        renderHook(() => useAdPageTargets(undefined, mockProfile));
        expect(setTargeting.mock.calls[8][1]).toBe('mobile');
    });

    it('should call setTargeting with the correct `topic_affinity` value', () => {
        const expectedTopic = 'Managing Yourself';
        const mockTopics = `${expectedTopic}|Receiving Feedback|Branding|Leadership & Managing People|Hiring`;
        cookieCutter.get.mockImplementationOnce(() => mockTopics);
        renderHook(() => useAdPageTargets(undefined, mockProfile));
        expect(setTargeting.mock.calls[5][1]).toBe(expectedTopic);
    });

    it('should call setTargeting with the correct `subscribed-enls` value', () => {
        const newsletterName1 = 'hbpTheDailyAlert';
        const newsletterName2 = 'hbpBestoftheIssue';

        mockProfile = {
            ...mockProfile,
            ...{
                newsletters: [
                    { name: newsletterName1 },
                    { name: newsletterName2 },
                ],
            },
        };

        renderHook(() => useAdPageTargets(undefined, mockProfile));
        expect(setTargeting.mock.calls[0][1]).toEqual(
            expect.stringMatching(new RegExp(`^${newsletterName1}`))
        );
        expect(setTargeting.mock.calls[0][1]).toEqual(
            expect.stringMatching(new RegExp(`${newsletterName2}$`))
        );
    });

    it('should call setTargeting with the correct `topics_followed` value', () => {
        const topicName1 = 'INNOVATION';
        const topicName2 = 'MANAGING YOURSELF';
        const topicName3 = 'NEGOTIATIONS';

        mockProfile = {
            ...mockProfile,
            ...{
                topics: [
                    { dimension: '4291323910', name: topicName1 },
                    { dimension: '4291323869', name: topicName2 },
                    { dimension: '4291323959', name: topicName3 },
                ],
            },
        };

        renderHook(() => useAdPageTargets(undefined, mockProfile));
        expect(setTargeting.mock.calls[6][1]).toEqual(
            expect.stringMatching(new RegExp(`^${topicName1}|`, 'i'))
        );
        expect(setTargeting.mock.calls[6][1]).toEqual(
            expect.stringMatching(new RegExp(`${topicName2}`, 'i'))
        );
        expect(setTargeting.mock.calls[6][1]).toEqual(
            expect.stringMatching(new RegExp(`|${topicName3}$`, 'i'))
        );
    });

    it('should call setTargeting with the correct `sub_access` value', () => {
        const accessLevel = 'BTM';

        mockProfile = {
            ...mockProfile,
            ...{
                subscriber: {
                    subscriptionAdTier: accessLevel,
                },
            },
        };

        renderHook(() => useAdPageTargets(undefined, mockProfile));
        expect(setTargeting.mock.calls[4][1]).toBe(accessLevel);
    });

    it('should call setTargeting with the correct target object values', () => {
        const targets = {
            iid: '73a647bc281441917e8f0879b0bd0fc5',
            pageType: 'LANDING',
            pid: '200',
            oxGroup: '537064956 ',
            title: 'Harvard Business Review - Most Popular',
        };

        renderHook(() => useAdPageTargets(targets, mockProfile));
        expect(setTargeting.mock.calls[12][1]).toBe(targets.iid);
        expect(setTargeting.mock.calls[14][1]).toBe(targets.pageType);
        expect(setTargeting.mock.calls[15][1]).toBe(targets.pid);
        expect(setTargeting.mock.calls[16][1]).toBe(targets.oxGroup);
        expect(setTargeting.mock.calls[18][1]).toBe(targets.title);
    });
});
