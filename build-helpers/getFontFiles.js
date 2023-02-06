import fs from 'fs';

const getFontFiles = () => {
    const fontsDir = 'src/scss/fonts';
    const fontDirs = fs.readdirSync(fontsDir);
    const fontFilePaths = [];

    fontDirs.forEach((fontDir) => {
        const path = `${fontsDir}/${fontDir}`;

        if (fs.lstatSync(path).isDirectory()) {
            const dirs = fs.readdirSync(path);

            dirs.forEach((dir) => {
                if (dir.endsWith('.scss')) {
                    fontFilePaths.push(`${path}/${dir}`);
                }
            });
        }
    });

    return fontFilePaths;
};

export default getFontFiles;
