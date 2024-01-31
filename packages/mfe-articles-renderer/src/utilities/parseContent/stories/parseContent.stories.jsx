import setupParser from '../parseContent';
import {
    defaultSetupParseCode,
    customResolversCode,
    customHBRComponentCode,
} from './codeExamples';

/**
 * Configures and returns a custom HTML parser function.
 *
 * ### Description
 The `setupParser` function is part of the `mfe-articles-renderer` package. It is specifically tailored for applications that consume the articles API, which often includes HTML strings in some of its JSON properties. The function enables resolvers customization, allowing users to define how different HTML tags present in the API's content should be handled and rendered within their React applications.
 *
 * ### Features and Capabilities:
 * - **Custom Resolvers for HTML Tags**: Allows defining custom components or rendering logic for specific HTML tags. Each resolver is a React component that dictates how a given HTML tag should be transformed or displayed.
 * - **HBR Component Overrides**: Specifically targets `hbr-component` tags, allowing users to provide custom variations for different `hbr-component` types. Default variations (implemented for the `mfe-articles-app`) are used unless overridden. See HBRComponentResolver story for more details.
 
 */
export default {
    title: 'MFE Articles Renderer/setupParser',
    component: setupParser,
    argTypes: {
        customResolvers: {
            description:
                'Custom resolvers for specific HTML tags, allowing for custom component rendering for those tags.',
            control: 'object',
        },
        hbrComponentOverrides: {
            description:
                'Overrides for specific `hbr-component` types. This allows for custom components to be rendered for specified types, while using default components for others.',
            control: 'object',
        },
        content: {
            description: 'The HTML content to be parsed.',
            control: 'text',
            table: {
                disable: true,
            },
        },
    },
    parameters: {
        docs: {
            canvas: {
                sourceState: 'shown',
            },
        },
    },
};

// Mock Components for Custom Resolvers
// eslint-disable-next-line react/prop-types
function CustomLinkComponent({ children }) {
    return <span style={{ color: 'green' }}>{children}</span>;
}

// Mock Component for hbr-component variarion resolver
function CustomPromoComponent() {
    return <div>Custom Promo Component Rendered</div>;
}

function Template(args) {
    const { customResolvers, hbrComponentOverrides, content } = args;
    const parseContent = setupParser({
        customResolvers,
        hbrComponentOverrides,
    });
    return <div>{parseContent(content)} </div>;
}

export const DefaultParser = {
    render: Template.bind({}),
    args: {
        customResolvers: {},
        hbrComponentOverrides: {},
        content:
            '<p>Sample text with a <a href="https://example.com">link</a>.</p><hbr-component type="promo"/>',
    },
    parameters: {
        docs: {
            source: {
                code: defaultSetupParseCode,
            },
            description: {
                story: 'Demonstrates using the parser with default settings.',
            },
        },
    },
};

// Custom Resolvers
export const CustomResolvers = {
    render: Template.bind({}),
    args: {
        customResolvers: { a: CustomLinkComponent },
        content:
            '<p>Sample text with a <a href="https://example.com">custom link resolver</a>.</p>',
    },
    parameters: {
        docs: {
            source: {
                code: customResolversCode,
            },
            description: {
                story: 'Shows how the parser handles custom resolvers, in this case, a custom component resolver for links.',
            },
        },
    },
};

// Custom HBRComponent type resolver
export const CustomHBRComponent = {
    render: Template.bind({}),
    args: {
        hbrComponentOverrides: { promo: CustomPromoComponent },
        content: '<p>Sample text.</p><hbr-component type="promo"/>',
    },
    parameters: {
        docs: {
            source: {
                code: customHBRComponentCode,
            },
            description: {
                story: 'Demonstrates using the parser with an specific custom component for the <code><hbr-component type="promo"></code>',
            },
        },
    },
};
