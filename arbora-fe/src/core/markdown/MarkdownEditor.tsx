import React from 'react';
import {
    defaultValueCtx,
    Editor,
    EditorStatus,
    editorViewCtx,
    editorViewOptionsCtx,
    rootCtx
} from '@milkdown/core';
import {nord} from '@milkdown/theme-nord';
import {Milkdown, MilkdownProvider, useEditor} from '@milkdown/react';
import {commonmark} from '@milkdown/preset-commonmark';
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {Box, HStack} from "@chakra-ui/react";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonIcon, PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {StandardConsole} from "../helpers/logging.ts";
import {Ctx} from "@milkdown/ctx";
import {replaceAll} from "@milkdown/utils";
import {JSONRecord} from "@milkdown/transformer";

interface MarkdownEditorProps {
    initial_content?: string
    updateContent: (content: string) => void
}

interface MilkdownEditorProps {
    editable: boolean
    initial_content: string
    setActiveContent: (content: string) => void
}

interface ProseNode extends Object {
    toJSON: () => JSONRecord
}


function MilkdownEditor({initial_content, editable, setActiveContent}: MilkdownEditorProps) {
    const [doc, setDoc] = React.useState<ProseNode | null>(null)

    const {get, loading} = useEditor((root) =>
        Editor.make()
            .config(nord)
            .config((ctx) => {
                ctx.set(rootCtx, root);

                ctx.update(editorViewOptionsCtx, (prev) => ({
                    ...prev,
                    attributes: {
                        class: 'milkdown-editor',
                        spellcheck: 'false',
                    },
                    editable: () => editable,
                }))
            })
            .config((ctx) => {
                ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
                    setActiveContent(markdown)
                }).updated((_ctx, doc) => {
                    setDoc(doc)
                })
            })
            .use(commonmark)
            .use(listener)
    );

    const editor = React.useMemo(() => {
        return get()
    }, [get]);

    editor?.onStatusChange((status) => {
        StandardConsole.log('editor status changed', status)
    })

    React.useEffect(() => {
        const effect = async () => {
            if (loading || !editor || editor.status !== EditorStatus.Created) {
                return
            }

            editor.use([
                (ctx: Ctx) => () => {
                    ctx.update(editorViewOptionsCtx, (prev) => ({
                        ...prev,
                        editable: () => editable,
                    }))
                    if (doc) {
                        ctx.set(defaultValueCtx, {
                            type: 'json',
                            value: doc.toJSON()
                        })
                    }
                },
            ].flat());
            await editor.create();
            if (editable) {
                // focus the editor
                editor.ctx.get(editorViewCtx).focus()
            }
        }

        requestAnimationFrame(() => {
            effect().then()
        });
    }, [editor, editable, loading]);

    // when the initial content changes, update the editor content
    React.useEffect(() => {
        if (editor) {
            editor.action(replaceAll(initial_content))
        }
    }, [editor, initial_content]);


    return (
        <Milkdown/>
    )
};

export function MarkdownEditor({initial_content, updateContent}: MarkdownEditorProps) {
    const [active_content, setActiveContent] = React.useState<string>(initial_content ?? '')
    const [editable, setEditable] = React.useState<boolean>(false)


    React.useEffect(() => {
        updateContent(active_content)
    }, [active_content, updateContent])

    const control_buttons = React.useMemo(() => {
        return (
            <HStack zIndex={200} position={'absolute'} top={0} right={0} p={'0.5rem'}>
                <PiButton
                    icon={editable ? PiButtonIcon.VIEW : PiButtonIcon.EDIT}
                    variant={PiButtonVariant.ICON}
                    onClick={() => setEditable(state => !state)}/>
                {/*<PiButton*/}
                {/*    icon={PiButtonIcon.SAVE}*/}
                {/*    variant={PiButtonVariant.ICON}*/}
                {/*    onClick={() => {*/}
                {/*        updateContent(active_content).then()*/}
                {/*    }*/}
                {/*    }/>*/}
            </HStack>
        )
    }, [setEditable, editable]);


    return (
        <MilkdownProvider>
            <Box position={'relative'} width={'100%'} h={'100%'} bg={'black'} py={'1rem'} px={'0.1rem'}>
                {control_buttons}
                <Box id={'milkdown-wrapper'} w={'100%'} h={'100%'} overflowY={'auto'}>
                    <MilkdownEditor editable={editable} initial_content={initial_content ?? ''}
                                    setActiveContent={setActiveContent}/>
                </Box>
            </Box>
        </MilkdownProvider>
    )
}
