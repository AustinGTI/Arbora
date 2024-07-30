import React from 'react';
import {Box, BoxProps, HStack, VStack} from "@chakra-ui/react";
import {ArboraHomePageContext} from "../../index.tsx";
import {ButtonOnClickFunction, PiButtonIcon, PiButtonVariant} from "../../../../pillars-ui/components/buttons/types.ts";
import PiButton from "../../../../pillars-ui/components/buttons/PiButton.tsx";
import {BsBodyText} from "react-icons/bs";
import useCollapse, {CollapseTimer} from "../../../../core/helpers/hooks/useCollapse.tsx";
import {MarkdownEditor} from "../../../../core/markdown/MarkdownEditor.tsx";
import {
    createDocumentService,
    deleteDocumentService,
    updateDocumentService
} from "../../../../core/services/documents/DocumentsCRUDServices.ts";
import {StandardConsole} from "../../../../core/helpers/logging.ts";
import PiPlainText from "../../../../pillars-ui/components/text/PiPlainText.tsx";
import useCountdownTimer from "../../../../core/helpers/hooks/useCountdownTimer.tsx";

interface SingleDocumentSectionProps extends BoxProps {
}

const SINGLE_DOCUMENT_COLLAPSE_TIMERS: CollapseTimer[] = [
    {key: 'button', collapse_delay: 1000, expand_delay: 0},
    {key: 'width', expand_delay: 0, collapse_delay: 500},
    {key: 'content-opacity', expand_delay: 500, collapse_delay: 0},
    {key: 'content-display', expand_delay: 400, collapse_delay: 100},
]

const AUTOSAVE_INTERVAL_IN_S = 30

export default function SingleDocumentSection({w, width, ...box_props}: SingleDocumentSectionProps) {
    const [current_editor_content, setCurrentEditorContent] = React.useState<string>('')

    const {t: t_minus_autosave, setTimer} = useCountdownTimer()

    const {
        single_doc_section: {active_document, setActiveDocument},
        all_documents_section: {reloadDocuments},
        control: {single_doc_section_collapsed, setSingleDocSectionCollapsed}
    } = React.useContext(ArboraHomePageContext)

    const updateActiveDocument = React.useCallback(async (new_content: string) => {
        // check if there is an active document
        if (!active_document) {
            StandardConsole.warn('No active document to update')
            return
        }
        updateDocumentService({
            id: active_document.id,
            title: active_document.title,
            content: new_content
        }).then((response) => {
            if (response.is_successful) {
                reloadDocuments()
            }
        })
    }, [active_document, reloadDocuments]);

    const createNewDocument: ButtonOnClickFunction = React.useCallback(async (setButtonLoadingState) => {
        // check if there is an active document
        if (active_document) {
            StandardConsole.warn('There is an active document, cannot create a new document')
            return
        }
        setButtonLoadingState(true)
        await createDocumentService({
            // todo: extract the title from the content
            title: `New Document # ${Math.floor(Math.random() * 1000)}`,
            content: current_editor_content
        }).then((response) => {
            if (response.is_successful) {
                reloadDocuments()
                if (response.data?.document) {
                    setActiveDocument(response.data.document)
                } else {
                    StandardConsole.error('Successfully created document but could not set active document')
                }
            }
        })
        setButtonLoadingState(false)
    }, [active_document, reloadDocuments, setActiveDocument, current_editor_content]);

    const deleteActiveDocument: ButtonOnClickFunction = React.useCallback(async (setButtonLoadingState) => {
        // check if there is an active document
        if (!active_document) {
            StandardConsole.warn('No active document to delete')
            return
        }
        setButtonLoadingState(true)
        await deleteDocumentService({
            id: active_document.id
        }).then((response) => {
            if (response.is_successful) {
                reloadDocuments()
            }
        })
        setButtonLoadingState(false)
    }, [active_document, reloadDocuments]);

    React.useEffect(() => {
        if (t_minus_autosave === 0 && active_document) {
            if (current_editor_content) {
                updateActiveDocument(current_editor_content).then()
            }
            setTimer(AUTOSAVE_INTERVAL_IN_S)
        }
    }, [t_minus_autosave, active_document]);

    const collapse_state = useCollapse(single_doc_section_collapsed, SINGLE_DOCUMENT_COLLAPSE_TIMERS)
    const collapse_button = React.useMemo(() => {
        return (
            <Box zIndex={200} p={'1rem'} position={'absolute'}
                 right={0} top={0}>
                <PiButton
                    variant={PiButtonVariant.ICON}
                    icon={!collapse_state.get('button') ? PiButtonIcon.CLOSE : BsBodyText}
                    icon_props={{fontSize: '30px'}}
                    onClick={() => {
                        setSingleDocSectionCollapsed(!single_doc_section_collapsed)
                    }}
                />
            </Box>
        )
    }, [single_doc_section_collapsed, setSingleDocSectionCollapsed, collapse_state]);

    return (
        <Box
            position={'relative'}
            bg={'rgba(255, 0, 0, 0.2)'}
            w={!collapse_state.get('width') ? w ?? width ?? '50vw' : 'calc(32px + 2rem)'}
            transition={'width 0.5s'}
            {...box_props}>
            {collapse_button}
            <VStack
                opacity={collapse_state.get('content-opacity') ? 0 : 1}
                display={collapse_state.get('content-display') ? 'none' : 'flex'}
                transition={'opacity 0.2s'}
                w={'100%'} h={'100%'} overflow={'hidden'} pt={'3rem'} px={'1rem'}>
                {active_document ? (
                    <HStack w={'100%'} justify={'space-between'}>
                        <HStack>
                            <PiButton
                                icon={PiButtonIcon.DELETE}
                                icon_props={{fontSize: '25px'}}
                                px={'.7rem'}
                                onClick={deleteActiveDocument}/>
                            <Box px={'.5rem'}>
                                <PiPlainText value={`Last auto-saved ${AUTOSAVE_INTERVAL_IN_S - t_minus_autosave}s ago`}
                                             fontSize={'13px'}/>
                            </Box>
                        </HStack>
                        <HStack>
                            <PiButton
                                label={'New Doc'}
                                icon={PiButtonIcon.ADD}
                                onClick={() => {
                                    setActiveDocument(null)
                                }}
                            />
                        </HStack>
                    </HStack>
                ) : (
                    <HStack w={'100%'} justify={'flex-end'}>
                        <PiButton
                            label={'Create Doc'}
                            icon={PiButtonIcon.SAVE}
                            onClick={createNewDocument}
                        />
                    </HStack>
                )}

                <Box w={'100%'} h={'85%'} mt={'.5rem'} borderRadius={'10px'} overflow={'hidden'}>
                    <MarkdownEditor
                        initial_content={active_document?.content}
                        updateContent={setCurrentEditorContent}/>
                </Box>

            </VStack>
        </Box>
    )
}