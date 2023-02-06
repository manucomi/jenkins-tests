const { getStoryContext } = require('@storybook/test-runner');
const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
    async preRender(page) {
        await injectAxe(page);
    },
    async postRender(page, context) {
        const storyContext = await getStoryContext(page, context);
        const containerSelector = '#root';
        const container = await page.$(containerSelector);
        await storyContext.parameters?.custom?.beforeA11y?.(container);
        await checkA11y(page, containerSelector, {
            detailedReport: true,
            detailedReportOptions: {
                html: true,
            },
        });
    },
};
