/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import HBRComponentResolver from '../../components/HBRComponentResolver/HBRComponentResolver';

const setupParser = ({
    customResolvers = {},
    hbrComponentOverrides = {},
} = {}) => {
    const HBRComponent = HBRComponentResolver(hbrComponentOverrides);
    const defaultResolverMap = {
        'hbr-component': HBRComponent,
    };

    const resolverMap = { ...defaultResolverMap, ...customResolvers };

    const parseContent = (sourceHTML) => {
        const options = {
            replace: ({ name, attribs, children }) => {
                const ResolverComponent = resolverMap[name];
                if (!ResolverComponent) return {};
                if (name === 'hbr-component') {
                    return (
                        <>
                            <ResolverComponent {...attribs} />
                            {domToReact(children, options)}
                        </>
                    );
                }

                return (
                    <ResolverComponent {...attribs}>
                        {domToReact(children, options)}
                    </ResolverComponent>
                );
            },
        };

        return parse(sourceHTML, options);
    };

    return parseContent;
};

export default setupParser;
