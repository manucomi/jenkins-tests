import path from 'path';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const createImageSnapshotConfig = ({ viewport: { width, height } }) => {
    return {
        storybookUrl: 'http://localhost:6006',
        getMatchOptions: ({ context: { fileName, id } }) => {
            const customSnapshotsDir = path.join(
                path.dirname(fileName),
                'snapshots'
            );
            const customDiffDir = path.join(customSnapshotsDir, 'diffs');

            return {
                customSnapshotIdentifier: `${id}-${width}x${height}`,
                customSnapshotsDir,
                customDiffDir,
            };
        },
        beforeScreenshot: async (page, { context }) => {
            await page.setViewport({ width, height });
            /**
             * container is an instance of ElementHandle from the puppeteer API.
             * https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-elementhandle
             */
            const container = await page.$('#root');
            await context.parameters?.custom?.beforeScreenshot?.(container);
        },
    };
};

initStoryshots({
    configPath: 'storybook',
    test: imageSnapshot(
        createImageSnapshotConfig({ viewport: { width: 1366, height: 768 } })
    ),
});

initStoryshots({
    configPath: 'storybook',
    test: imageSnapshot(
        createImageSnapshotConfig({ viewport: { width: 768, height: 1024 } })
    ),
});

initStoryshots({
    configPath: 'storybook',
    test: imageSnapshot(
        createImageSnapshotConfig({ viewport: { width: 360, height: 640 } })
    ),
});
