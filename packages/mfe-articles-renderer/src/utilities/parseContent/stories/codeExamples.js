export const defaultSetupParseCode = `import setupParser from 'mfe-articles-renderer/utils/parseContent';\n 
const sourceHTML = '<p>Sample text with a <a href="https://example.com">link</a>.</p><hbr-component type="promo"/>';
const parseContent = setupParser(); 
const content = parseContent(sourceHTML);`;

export const customResolversCode = `import setupParser from 'mfe-articles-renderer/utils/parseContent';\n
const sourceHTML = '<p>Sample text with a <a href="https://example.com">custom link resolver</a>.</p>';
const config = {
    customResolvers: {
        a: CustomLinkComponent, // Custom resolver for <a> tags
    };
}
const parseContent = setupParser(config);
const content = parseContent(sourceHTML);`;

export const customHBRComponentCode = `import setupParser from 'mfe-articles-renderer/utils/parseContent';\n 
const sourceHTML = '<p>Sample text.</p><hbr-component type="promo"/>';
const config = {
    hbrComponentOverrides: {
        promo: CustomPromoComponent,
    };
}
const parseContent = setupParser(config);
const content = parseContent(sourceHTML);`;
