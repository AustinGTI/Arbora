import React from 'react';
import {Editor, rootCtx} from '@milkdown/core';
import {nord} from '@milkdown/theme-nord';
import {Milkdown, MilkdownProvider, useEditor} from '@milkdown/react';
import {commonmark} from '@milkdown/preset-commonmark';
import {Box} from "@chakra-ui/react";

const MilkdownEditor: React.FC = () => {
    const {} = useEditor((root) =>
        Editor.make()
            .config(nord)
            .config((ctx) => {
                ctx.set(rootCtx, root);
            })
            .use(commonmark),
    );

    return <Box minWidth={'100%'} minHeight={'100%'}><Milkdown/></Box>;
};

export const MarkdownEditor: React.FC = () => {
    return (
        <MilkdownProvider>
            <MilkdownEditor/>
        </MilkdownProvider>
    );
};