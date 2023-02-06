// eslint-disable-next-line import/extensions
import DataLayerService from 'Services/DataLayerService/DataLayerService';
import MobileDetect from 'mobile-detect';
/**
 * This class represents a data layer and provides methods for maintaining
 * an instance of the data layer. It also provides update methods for
 * committing changes to `window.digitalData`.
 *
 * @example - Instantiate a DataLayer and initialize it with fetched data.
 * const dataLayer = new DataLayer();
 * await dataLayer.init();
 * console.log(dataLayer.digitalData);
 * @example - Instantiate a DataLayer and initialize it with existing data.
 * const dataLayer = new DataLayer(window.digitalData);
 * console.log(dataLayer.digitalData);
 * @example - Update `window.digitalData.users`.
 * const dataLayer = new DataLayer();
 * await dataLayer.init();
 * dataLayer.updateUsers();
 * @example - Set events and update `window.digitalData.event`.
 * const dataLayer = new DataLayer(window.digitalData);
 * dataLayer.setCompletedSaveEvent();
 * dataLayer.updateEvent();
 */
const DataLayer = class {
    /**
     * @private
     */
    #digitalData;

    /**
     * Create a data layer.
     *
     * @param {object} [data={}] - An initial data layer object.
     */
    constructor(data = {}) {
        this.#digitalData = data;
    }

    /**
     * Initializes `#digitalData` with an object from the API.
     *
     * @param {object} [serverOptions={}] - Options to be used server side.
     * @param {string} serverOptions.baseURL - This is prepended with the API path.
     * @param {object} serverOptions.request - The incoming request that was received by the server.
     * @returns {Promise} - A resolved promise indicating success.
     */
    async init(serverOptions = {}) {
        const deviceDetector = new MobileDetect(
            serverOptions.request?.headers['user-agent'] ??
                window.navigator.userAgent
        );
        const mobile = 'Mobile';
        const desktop = 'Desktop';
        const tablet = 'Tablet';
        let deviceType = desktop;
        let sysEnv = desktop;

        if (deviceDetector.phone()) {
            deviceType = mobile;
            sysEnv = mobile;
        } else if (deviceDetector.tablet()) {
            deviceType = tablet;
            sysEnv = mobile;
        }

        let pageURL;

        if (serverOptions.request) {
            pageURL = `${serverOptions.request.protocol}://${serverOptions.request.headers.host}${serverOptions.request.path}`;
        } else {
            pageURL = window.location.href;
        }

        let referringURL = '';

        if (serverOptions.request?.headers?.referer) {
            referringURL = serverOptions.request.headers.referer;
        } else if (typeof document !== 'undefined') {
            referringURL = document.referrer;
        }

        const initialData = {
            page: {
                pageInfo: {
                    deviceType,
                    pageURL,
                    referringURL,
                    sysEnv,
                    pageDescription:
                        "Find new ideas and classic advice on strategy, innovation and leadership, for global leaders from the world's best business and management experts.",
                    pageName: 'Harvard Business Review - Most Popular',
                },
            },
            pageInstanceID: 'Harvard Business Review - Most Popular',
            siteID: 'hbrprod',
            siteType: 'Desktop',
            version: '2.2',
        };

        try {
            const { page, users } = await DataLayerService.getDigitaldata(
                serverOptions
            );

            initialData.page.pageInfo = {
                ...page?.pageInfo,
                ...initialData.page.pageInfo,
            };
            initialData.users = users;

            if (
                initialData.users.length &&
                initialData.users[0].profile?.daysSinceLastVisit < 1
            ) {
                initialData.users[0].profile.daysSinceLastVisit =
                    'Less Than One Day';
            }
        } catch (error) {
            console.log(error);
        }
        this.#digitalData = initialData;
        return Promise.resolve();
    }

    /**
     * Getter for the private member `#digitalData`.
     *
     * @returns {object} - The private member `#digitalData` which represents a data layer.
     */
    get digitalData() {
        return this.#digitalData;
    }

    /**
     * Sets the number of search results on the page.
     *
     * @param {number} total - The total number of search results on the page.
     */
    setOnsiteSearchResults(total) {
        if (!this.#digitalData.page) {
            this.#digitalData.page = { pageInfo: {} };
        }

        if (!this.#digitalData.page.pageInfo) {
            this.#digitalData.page.pageInfo = {};
        }

        this.#digitalData.page.pageInfo.onsiteSearchResults = total;
    }

    /**
     * Sets an event with the given event info.
     *
     * @param {object} eventInfo - An object containing event data points.
     * @private
     */
    #setEvent(eventInfo) {
        this.#digitalData.event = [{ eventInfo }];
    }

    /**
     * Sets an event indicating a user completed registration.
     */
    setRegistrationEvent() {
        this.#setEvent({
            eventName: 'Account Interaction',
            eventAction: 'Registration',
        });
    }

    /**
     * Sets an event indicating a user completed saving content to their folders.
     *
     * @param {string} contentTitle - The title of the content that was saved.
     * @param {string} contentType - The type of content that was saved.
     */
    setCompletedSaveEvent(contentTitle, contentType) {
        this.#setEvent({
            actionSource: 'Landing Page',
            contentName: contentTitle,
            eventName: 'Content Interaction',
            eventAction: 'Content Save - Completion',
            contentType,
        });
    }

    /**
     * Set an event indicating a user intends to save content to their folders.
     *
     * @param {string} contentTitle - The title of the content the user intends to save.
     * @param {string} contentType - The type of content the user intends to save.
     */
    setInitiatedSaveEvent(contentTitle, contentType) {
        this.#setEvent({
            actionSource: 'Landing Page',
            contentName: contentTitle,
            eventName: 'Content Interaction',
            eventAction: 'Content Save - Initiation',
            contentType,
        });
    }

    /**
     * Sets an event indicating a user finished sharing content.
     *
     * @param {string} contentTitle - The title of the content the user shared.
     * @param {string} contentType - The type of content the user shared.
     * @param {string} shareType - The platform the user shared content with.
     */
    setCompletedShareEvent(contentTitle, contentType, shareType) {
        this.#setEvent({
            actionSource: 'Landing Page',
            contentName: contentTitle,
            eventName: 'Content Interaction',
            eventAction: 'Content Share - Completion',
            shareMedium: shareType,
            contentType,
        });
    }

    /**
     * Sets an event indicating a user intends to share content.
     *
     * @param {string} contentTitle - The title of the content the user intends to share.
     * @param {string} contentType - The type of content the user intends to share.
     */
    setInitiatedShareEvent(contentTitle, contentType) {
        this.#setEvent({
            actionSource: 'Landing Page',
            contentName: contentTitle,
            eventName: 'Content Interaction',
            eventAction: 'Content Share - Initiation',
            contentType,
        });
    }

    /**
     * Sets an event indicating a user completed signing in.
     */
    setSignInEvent() {
        this.#setEvent({
            eventName: 'Account Interaction',
            eventAction: 'Account Login',
        });
    }

    /**
     * Sets an event indicating a user subscribed for a newsletter
     * and which newsletter they subscribed to.
     *
     * @param {string} newsletterName - The string identifier of the newsletter.
     */
    setNewsletterSubscribeEvent(newsletterName) {
        this.#setEvent({
            eventName: 'Profile Update',
            eventAction: 'Newsletter Subscription',
            newsletterName,
        });
    }

    /**
     * Sets an event indicating a user unsubscribed for a newsletter
     * and which newsletter they unsubscribed to.
     *
     * @param {string} newsletterName - The string identifier of the newsletter.
     */
    setNewsletterUnsubscribeEvent(newsletterName) {
        this.#setEvent({
            eventName: 'Profile Update',
            eventAction: 'Newsletter Unsubscribe',
            newsletterName,
        });
    }

    /**
     * This method replaces `window.digitalData.event` with the current event
     * set in the instance.
     */
    updateEvent() {
        if (!window.digitalData) {
            window.digitalData = {};
        }

        window.digitalData.event = this.#digitalData.event || [];
    }

    /**
     * This method replaces `window.digitalData.users` with the current users
     * set in the instance.
     */
    updateUsers() {
        if (!window.digitalData) {
            window.digitalData = {};
        }

        window.digitalData.users = this.#digitalData.users || [];
    }
};

export default DataLayer;
