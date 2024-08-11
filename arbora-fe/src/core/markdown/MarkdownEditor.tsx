import React from 'react';
import {defaultValueCtx, Editor, EditorStatus, editorViewCtx, editorViewOptionsCtx, rootCtx,} from '@milkdown/core';
import {nord} from '@milkdown/theme-nord';
import {Milkdown, MilkdownProvider, useEditor} from '@milkdown/react';
import {commonmark, headingAttr} from '@milkdown/preset-commonmark';
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {Box, HStack} from "@chakra-ui/react";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonIcon, PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import {Ctx, MilkdownPlugin} from "@milkdown/ctx";
import {addAIButtonToHeaders} from "./dom.ts";
import useGlobalHomeState from "../redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {setEditorContent, setEditorEditable} from "../redux/home/home_slice.ts";
import {replaceAll} from "@milkdown/utils"
import {ARBORA_GREEN} from "../constants/styling.ts";
import PiPlainText from "../../pillars-ui/components/text/PiPlainText.tsx";

interface MilkdownEditorProps {
    editable: boolean
    initial_content: string
    setActiveContent: (content: string) => void
}

function MilkdownEditor({initial_content, editable, setActiveContent}: MilkdownEditorProps) {
    const [current_content, setCurrentContent] = React.useState<string>(initial_content)
    const initial_content_ref = React.useRef<string>(initial_content);
    const plugin_ref = React.useRef<MilkdownPlugin | null>(null);

    React.useEffect(() => {
        setActiveContent(current_content)
    }, [current_content]);

    React.useEffect(() => {
        setCurrentContent(initial_content)
    }, [initial_content]);

    const {get, loading} = useEditor((root) =>
        Editor.make()
            .config(nord)
            .config((ctx: Ctx) => {
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
            .config((ctx: Ctx) => {
                ctx.set(headingAttr.key, (node) => {
                    const level = node.attrs.level
                    return {
                        class: `md-header md-header-${level}`
                    }
                })

                ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
                    setCurrentContent(markdown)
                })
            })
            .use(commonmark)
            .use(listener)
    );

    const editor = React.useMemo(() => {
        return get()
    }, [get]);

    React.useEffect(() => {
        const effect = async () => {
            if (loading || !editor || editor.status !== EditorStatus.Created) {
                return
            }

            if (plugin_ref.current) {
                await editor.remove(plugin_ref.current)
            }
            const initPlugin = (ctx: Ctx) => () => {
                ctx.update(editorViewOptionsCtx, (prev) => ({
                    ...prev,
                    editable: () => editable,
                }))
                if (initial_content_ref.current !== initial_content) {
                    ctx.set(defaultValueCtx, initial_content)
                    initial_content_ref.current = initial_content
                } else {
                    ctx.set(defaultValueCtx, current_content)
                }
            }

            editor.use(initPlugin);

            await editor.create();

            if (editable) {
                // focus the editor
                editor.ctx.get(editorViewCtx).focus()
            } else {
                addAIButtonToHeaders()
            }

            plugin_ref.current = initPlugin
        }

        requestAnimationFrame(() => {
            effect().then()
        });
    }, [editor, editable, loading]);


    // when the initial content changes, update the editor content
    React.useEffect(() => {
        if (editor) {
            editor.action(replaceAll(initial_content))
            if (!editable) {
                addAIButtonToHeaders()
            }
        }
    }, [editor, initial_content]);


    return (
        <Milkdown/>
    )
};

export function MarkdownEditor() {
    const {
        documents: {active_document},
        document_view: {tab_data: {editor_data: {editable}}}
    } = useGlobalHomeState()
    const dispatch = useDispatch()


    // when the active document id changes, set the editable back to view mode and update the content
    React.useEffect(() => {
        if (active_document) {
            dispatch(setEditorContent(active_document.content))
            dispatch(setEditorEditable(false))
        } else {
            dispatch(setEditorContent(''))
            dispatch(setEditorEditable(true))
        }
    }, [active_document?.id]);

    const control_buttons = React.useMemo(() => {
        return (
            <React.Fragment>
                <HStack zIndex={200} position={'absolute'} top={0} right={0} p={'0.5rem'}>
                    <PiButton
                        icon={editable ? PiButtonIcon.VIEW : PiButtonIcon.EDIT}
                        variant={PiButtonVariant.ICON}
                        fontWeight={700}
                        fontSize={'16px'}
                        with_tooltip
                        tooltip_label={`Toggle document to ${editable ? 'view' : 'edit'} mode`}
                        tooltip_placement={'left'}
                        py={'3px'} px={'20px'} rounded={'6px'}
                        onClick={() => {
                            dispatch(setEditorEditable(!editable))
                        }}/>
                    {/*<PiButton*/}
                    {/*    icon={PiButtonIcon.SAVE}*/}
                    {/*    variant={PiButtonVariant.ICON}*/}
                    {/*    onClick={() => {*/}
                    {/*        updateContent(active_content).then()*/}
                    {/*    }*/}
                    {/*    }/>*/}
                </HStack>
                <HStack zIndex={200} position={'absolute'} bottom={0} right={0} p={'0.5rem'}>
                    <PiPlainText
                        value={editable ? 'EDIT MODE' : 'VIEW MODE'}
                        fontWeight={700}
                        fontSize={'14px'}
                        color={editable ? ARBORA_GREEN.fg : ARBORA_GREEN.hard}
                        bg={editable ? ARBORA_GREEN.hard : ARBORA_GREEN.fg}
                        py={'3px'} px={'7px'} rounded={'6px'}/>
                    {/*<PiButton*/}
                    {/*    icon={PiButtonIcon.SAVE}*/}
                    {/*    variant={PiButtonVariant.ICON}*/}
                    {/*    onClick={() => {*/}
                    {/*        updateContent(active_content).then()*/}
                    {/*    }*/}
                    {/*    }/>*/}
                </HStack>
            </React.Fragment>
        )
    }, [editable, dispatch]);


    return (
        <MilkdownProvider>
            <Box position={'relative'} width={'100%'} h={'100%'} bg={ARBORA_GREEN.bg} py={'1rem'} px={'0.1rem'}>
                {control_buttons}
                <Box className={`milkdown-wrapper ${editable ? 'edit-mode' : 'review-mode'}`} w={'100%'} h={'100%'}
                     overflowY={'auto'}>
                    <MilkdownEditor editable={editable} initial_content={active_document?.content ?? ''}
                                    setActiveContent={(content) => {
                                        dispatch(setEditorContent(content))
                                    }}/>
                </Box>
            </Box>
        </MilkdownProvider>
    )
}
