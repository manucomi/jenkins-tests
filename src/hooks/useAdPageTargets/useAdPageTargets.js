/* global googletag */
import { useEffect } from 'react';
import cookieCutter from 'cookie-cutter';
import MobileDetect from 'mobile-detect';

/**
 * A React hook that sets key-value pairs at the page level (vs individual slot
 * level) to control which ads should show on a particular page.
 */
const useAdPageTargets = (targets, profile) => {
    useEffect(() => {
        const finalTargets = {
            layout: '',
            author: '',
            cid: '',
            category: '',
            iid: '',
            item: '',
            pageType: '',
            pid: '',
            oxGroup: '',
            articleType: '',
            title: '',
            shopperAttributes: '',
            dev: '0',
            subOnly: 'false',
        };

        if (targets) {
            Object.keys(targets).forEach((key) => {
                finalTargets[key] = targets[key];
            });
        }

        window.googletag = window.googletag || { cmd: [] };

        const deviceDetector = new MobileDetect(window.navigator.userAgent);
        const getTopicAffinity = () => {
            return (
                cookieCutter.get('analytics_TopicAffinity')?.split('|')[0] ?? ''
            );
        };

        if (profile) {
            const {
                subscriber,
                newsletters,
                topics,
                industry,
                jobTitle,
                companySize,
            } = profile;

            // User's subscription tier (Good, Better, Best).
            const accessLevel = subscriber?.subscriptionAdTier ?? '';

            // User's subscription status.
            const subscriptionStatus = subscriber?.subscriptionStatus ?? '';

            const getNewsletterNames = () => {
                // Newsletters the user is subscribed to.
                return newsletters.length > 0
                    ? newsletters.map((newsletter) => newsletter.name).join('|')
                    : '';
            };

            const getTopicsFollowed = () => {
                // Topics the user is following.
                return topics.length > 0
                    ? topics
                          .map((topic) => {
                              const topicName = topic.name.toLowerCase();
                              return (
                                  topicName.charAt(0).toUpperCase() +
                                  topicName.slice(1)
                              );
                          })
                          .join('|')
                    : '';
            };

            googletag.cmd.push(() => {
                googletag
                    .pubads()
                    .setTargeting('subscribed-enls', getNewsletterNames());
                googletag.pubads().setTargeting('industry', industry);
                googletag.pubads().setTargeting('job-title', jobTitle);
                googletag.pubads().setTargeting('company-size', companySize);
                googletag.pubads().setTargeting('sub_access', accessLevel);
                googletag
                    .pubads()
                    .setTargeting('topic_affinity', getTopicAffinity());
                googletag
                    .pubads()
                    .setTargeting('topics_followed', getTopicsFollowed());
                googletag
                    .pubads()
                    .setTargeting('sub_status', subscriptionStatus);
            });
        }

        googletag.cmd.push(() => {
            googletag
                .pubads()
                .setTargeting(
                    'layout',
                    deviceDetector.mobile() ? 'mobile' : 'desktop'
                );
            googletag.pubads().setTargeting('author', finalTargets.author);
            googletag.pubads().setTargeting('cid', finalTargets.cid);
            googletag.pubads().setTargeting('category', finalTargets.category);
            googletag.pubads().setTargeting('iid', finalTargets.iid);
            googletag.pubads().setTargeting('item', finalTargets.item);
            googletag.pubads().setTargeting('page-type', finalTargets.pageType);
            googletag.pubads().setTargeting('pid', finalTargets.pid);
            googletag.pubads().setTargeting('ox-group', finalTargets.oxGroup);
            googletag
                .pubads()
                .setTargeting('article-type', finalTargets.articleType);
            googletag.pubads().setTargeting('title', finalTargets.title);
            googletag.pubads().setTargeting('type', finalTargets.type);
            googletag
                .pubads()
                .setTargeting(
                    'shopper-attributes',
                    finalTargets.shopperAttributes
                );
            googletag.pubads().setTargeting('url', window.location.pathname);
            googletag.pubads().setTargeting('dev', finalTargets.dev);
            googletag
                .pubads()
                .setTargeting('hostname', window.location.hostname);
            googletag.pubads().setTargeting('sub_only', finalTargets.subOnly);
        });
    }, [profile, targets]);
};

export default useAdPageTargets;
