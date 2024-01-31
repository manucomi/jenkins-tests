import setupParser from '../../../utilities/parseContent/parseContent';
import HBRComponentResolver from '../HBRComponentResolver';

export default {
    title: 'MFE Articles Renderer/HBRComponentResolver',
    component: HBRComponentResolver,
};

function CustomPromoComponent() {
    return <div>Custom Promo Component Rendered</div>;
}
function CustomNewsletterComponent() {
    return <div>Custom Newsletter Component Rendered</div>;
}

function Template(args) {
    const { variations, content } = args;
    const parseContent = setupParser({ hbrComponentOverrides: variations });
    return <div>{parseContent(content)} </div>;
}

export const Default = {
    name: 'Default Variations',
    render: Template.bind({}),
    argTypes: {
        variations: {
            description: `An object of key-value pairs, where each key is a "type" of the hbr-component, and the value is the React component that should be rendered for that type. 
                If no custom variation is provided for a specific type, the default variations are used: promo, series, newsletter, etc., each defaulting to a Component`,
            defaultValue: {
                summary: '{}',
                detail: `Default variations: {
                    promo: HBRComponent,
                    series: HBRComponent,
                    newsletter: HBRComponent,
                    'newsletter-tout': HBRComponent,
                    'podcast-promo': HBRComponent,
                    'author-info': HBRComponent,
                    'reading-list': HBRComponent,
                    'related-content': HBRComponent,
                    'section-header': HBRComponent
                }`,
            },
            control: 'object',
        },
        content: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        variations: {}, // Using default variations
        content: `<h1>Heading</h1>
              <hbr-component type="promo"></hbr-component>
              <hbr-component type="newsletter"></hbr-component>
              <p>Text in paragraph</p>`,
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates using HBRComponentResolver with default component variations.',
            },
        },
    },
};

export const CustomVariations = {
    render: Template.bind({}),
    args: {
        variations: {
            promo: CustomPromoComponent,
            newsletter: CustomNewsletterComponent,
        },
        content: `<h1>Heading</h1>
              <hbr-component type="promo"></hbr-component>
              <hbr-component type="newsletter"></hbr-component>
              <p>Text in paragraph</p>`,
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how HBRComponentResolver handles custom variations, overriding the default ones.',
            },
        },
    },
};
