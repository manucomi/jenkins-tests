import FontIcon from '../FontIcon/FontIcon';

const explore = {
    category: 'Explore HBR',
    links: [
        {
            text: 'The Latest',
            href: '/the-latest',
        },
        {
            text: 'Most Popular',
            href: '/most-popular',
        },
        {
            text: 'All Topics',
            href: '/topics',
        },
        {
            text: 'Magazine Archive',
            href: '/magazine',
        },
        {
            text: 'The Big Idea',
            href: '/big-ideas',
        },
        {
            text: 'Reading Lists',
            href: '/reading-lists',
        },
        {
            text: 'Case Selections',
            href: '/case-selections',
        },
        {
            text: 'Video',
            href: '/video',
        },
        {
            text: 'Podcasts',
            href: '/podcasts',
        },
        {
            text: 'Webinars',
            href: '/webinars',
        },
        {
            text: 'Data & Visuals',
            href: '/data-visuals',
        },
        {
            text: 'My Library',
            href: '/my-library',
        },
        {
            text: 'Newsletters',
            href: '/email-newsletters',
        },
        {
            text: 'HBR Press',
            href: '/hbrpress',
        },
        {
            text: 'HBR Ascend',
            href: '/insight-center/ascend',
        },
    ],
};

const store = {
    category: 'HBR Store',
    links: [
        {
            text: 'Article Reprints',
            href: '/store/articles',
        },
        {
            text: 'Books',
            href: '/store/books',
        },
        {
            text: 'Cases',
            href: '/store/case-studies',
        },
        {
            text: 'Collections',
            href: '/store/collections',
        },
        {
            text: 'Magazine Issues',
            href: '/store/magazine-issues',
        },
        {
            text: 'HBR Guide Series',
            href: '/store/landing/guides',
        },
        {
            text: 'HBR 20-Minute Managers',
            href: '/store/landing/20-minute-managers',
        },
        {
            text: 'HBR Emotional Intelligence Series',
            href: '/store/landing/emotional-intelligence-series',
        },
        {
            text: 'HBR Must Reads',
            href: '/store/landing/mustreads',
        },
        {
            text: 'Tools',
            href: '/store/tools',
        },
    ],
};

const about = {
    category: 'About HBR',
    links: [
        {
            text: 'Contact Us',
            href: '/contact-us',
        },
        {
            text: 'Advertise with Us',
            href: '/hbr-advertising-sales',
        },
        {
            text: 'Information for Booksellers/Retailers',
            href: '/booksellers-retailers',
        },
        {
            text: 'Masthead',
            href: '/about-hbr',
        },
        {
            text: 'Global Editions',
            href: '/global-editions',
        },
        {
            text: 'Media Inquiries',
            href: '/media-inquiries',
        },
        {
            text: 'Guidelines for Authors',
            href: '/guidelines-for-authors-web',
        },
        {
            text: 'HBR Analytic Services',
            href: '/hbr-analytic-services',
        },
        {
            text: 'Copyright Permissions',
            href: '/permissions',
        },
    ],
};

const manage = {
    category: 'Manage My Account',
    links: [
        {
            requireAuth: true,
            text: 'My Library',
            href: '/my-library',
        },
        {
            requireAuth: true,
            text: 'Topic Feeds',
            href: '/topics',
        },
        {
            requireAuth: true,
            text: 'Orders',
            href: '/my-library/orders',
        },
        {
            requireAuth: true,
            text: 'Account Settings',
            href: '/my-library/settings',
        },
        {
            requireAuth: true,
            text: 'Email Preferences',
            href: '/my-library/preferences',
        },
        {
            requireAuth: true,
            text: 'Account FAQ',
            href: '/subscriber-help',
        },
        {
            requireAuth: true,
            text: 'Help Center',
            href: 'https://hbphelp.zendesk.com/hc/en-us',
        },
        {
            requireAuth: true,
            text: 'Contact Customer Service',
            href: '/subscriber-help#contact-customer-service',
        },
    ],
};

const follow = {
    category: 'Follow HBR',
    links: [
        {
            text: 'Facebook',
            href: 'https://www.facebook.com/HBR',
            icon: FontIcon.variants.FACEBOOK,
        },
        {
            text: 'Twitter',
            href: 'http://twitter.com/HarvardBiz',
            icon: FontIcon.variants.TWITTER,
        },
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/company/harvard-business-review?trk=biz-companies-cym',
            icon: FontIcon.variants.LINKEDIN,
        },
        {
            text: 'Instagram',
            href: 'https://www.instagram.com/harvard_business_review/?hl=en',
            icon: FontIcon.variants.INSTAGRAM,
        },
        {
            text: 'Your Newsreader',
            href: 'http://feeds.hbr.org/harvardbusiness/',
            icon: FontIcon.variants.RSS,
        },
    ],
};

const links = { about, store, explore, manage, follow };
export default links;
