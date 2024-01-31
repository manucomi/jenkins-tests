import fs from 'fs';

const getFilesFromDir = (srcDir, outputDir) => {
    const files = fs.readdirSync(srcDir);
    const filePaths = {};

    files.forEach((file) => {
        const path = `${srcDir}/${file}`;

        if (fs.lstatSync(path).isDirectory()) {
            const dirs = fs.readdirSync(path);

            dirs.forEach((dir) => {
                if (dir === 'index.js') {
                    filePaths[`${outputDir}/${file}`] = `${path}/${dir}`;
                }
            });
        }
    });

    return filePaths;
};

export default getFilesFromDir;
