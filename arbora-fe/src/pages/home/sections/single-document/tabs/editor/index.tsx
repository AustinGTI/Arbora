import React from 'react';
import useCountdownTimer from "../../../../../../core/helpers/hooks/useCountdownTimer.tsx";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import {
    createDocumentService, deleteDocumentService,
    updateDocumentService
} from "../../../../../../core/services/documents/DocumentsCRUDServices.ts";
import {reloadHomeData, setActiveDocument, setEditorEditable} from "../../../../../../core/redux/home/home_slice.ts";
import {ButtonOnClickFunction, PiButtonIcon} from "../../../../../../pillars-ui/components/buttons/types.ts";
import {Box, HStack, VStack} from "@chakra-ui/react";
import PiButton from "../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {MarkdownEditor} from "../../../../../../core/markdown/MarkdownEditor.tsx";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";

const AUTOSAVE_INTERVAL_IN_S = 10
export default function DocumentViewEditorTab() {
    const {
        documents: {active_document, active_note},
        document_view: {
            tab_data: {editor_data: {editable, content}}
        }
    } = useGlobalHomeState()
    const dispatch = useDispatch()

    // region CRUD FUNCTIONS
    // ? ........................

    const updateActiveDocument = React.useCallback(async () => {
        // check if there is an active document
        if (!active_document) {
            StandardConsole.warn('No active document to update')
            return
        }
        updateDocumentService({
            id: active_document.id,
            content
        }).then((response) => {
            if (response.is_successful) {
                dispatch(reloadHomeData({with_note_reset: true}))
                dispatch(setEditorEditable(false))
            }
        })
    }, [active_document, dispatch, content]);

    const createNewDocument: ButtonOnClickFunction = React.useCallback(async () => {
        // check if there is an active document
        if (active_document) {
            StandardConsole.warn('There is an active document, cannot create a new document')
            return
        }
        // check that there is content
        if (!content) {
            StandardConsole.warn('Cannot create a new document without content')
            return
        }
        createDocumentService({
            content: content
        }).then((response) => {
            if (response.is_successful) {
                dispatch(reloadHomeData({with_note_reset: false}))
                if (response.data?.document) {
                    dispatch(setActiveDocument(response.data.document))
                    // set to view mode

                } else {
                    StandardConsole.error('Successfully created document but could not set active document')
                }
            }
        })
    }, [active_document, dispatch, content]);

    const deleteActiveDocument = React.useCallback(async () => {
        // check if there is an active document
        if (!active_document) {
            StandardConsole.warn('No active document to delete')
            return
        }
        await deleteDocumentService({
            id: active_document.id
        }).then((response) => {
            if (response.is_successful) {
                dispatch(reloadHomeData({with_note_reset: true}))
            }
        })
    }, [active_document, dispatch]);


    // ? ........................
    // endregion ........................

    // region AUTO SAVE ACTIVE DOCUMENT
    // ? ........................

    const {t: t_minus_autosave, setTimer} = useCountdownTimer()
    React.useEffect(() => {
        if (t_minus_autosave === 1000 && active_document) {
            if (content) {
                updateActiveDocument().then()
            }
            setTimer(AUTOSAVE_INTERVAL_IN_S)
        }
    }, [t_minus_autosave, active_document]);

    // ? ........................
    // endregion ........................

    React.useEffect(() => {
        // when the active note changes and the editor is in edit mode, scroll the
        // editor to the note
        StandardConsole.log('attempting to scroll')
        // wait a few ms for the content to load
        if (active_note && !editable) {
            setTimeout(() => {
                const editor_elem = document.getElementsByClassName('milkdown-wrapper')[0]
                if (!editor_elem) {
                    StandardConsole.warn('Could not find editor element')
                    return
                }
                const header_elem_class_name = `header-key-${active_note.replace(/\./g, '-')}`
                const header_elem = document.getElementsByClassName(header_elem_class_name)[0]

                if (!header_elem) {
                    StandardConsole.warn('Could not find header element')
                    return
                }

                // remove active header from any existing header
                Array.from(document.getElementsByClassName('active-header')).forEach((elem) => {
                    elem.classList.remove('active-header')
                })

                // add an active header class to the header element
                header_elem.classList.add('active-header')


                editor_elem.scrollTo({
                    top: header_elem.getBoundingClientRect().top - editor_elem.getBoundingClientRect().top,
                    behavior: 'smooth'
                })

                StandardConsole.log('scrolled ', header_elem.getBoundingClientRect().top - editor_elem.getBoundingClientRect().top)
            }, 200)
        }
    }, [active_note]);

    return (
        <VStack w={'100%'} h={'100%'} px={'1rem'}>
            {active_document ? (
                <HStack w={'100%'} justify={'space-between'} h={'40px'}>
                    <HStack>
                        <PiButton
                            icon={PiButtonIcon.DELETE}
                            icon_props={{fontSize: '25px'}}
                            px={'.7rem'}
                            onClick={deleteActiveDocument}/>
                        <PiButton
                            icon={PiButtonIcon.SAVE}
                            icon_props={{fontSize: '25px'}}
                            px={'.7rem'}
                            onClick={async () => {
                                await updateActiveDocument()
                            }}/>
                        {/*<Box px={'.5rem'}>*/}
                        {/*    <PiPlainText value={`Last auto-saved ${AUTOSAVE_INTERVAL_IN_S - t_minus_autosave}s ago`}*/}
                        {/*                 fontSize={'13px'}/>*/}
                        {/*</Box>*/}
                    </HStack>
                    <ActiveDocumentNoteSelector is_disabled={editable}/>
                    <HStack>
                        <PiButton
                            label={'New Doc'}
                            icon={PiButtonIcon.ADD}
                            onClick={() => {
                                dispatch(setActiveDocument(null))
                            }}
                        />
                    </HStack>
                </HStack>
            ) : (
                <HStack w={'100%'} justify={'flex-end'} h={'40px'}>
                    <PiButton
                        label={'Create Doc'}
                        icon={PiButtonIcon.SAVE}
                        isDisabled={!content}
                        onClick={createNewDocument}
                    />
                </HStack>
            )}

            <Box w={'100%'} h={'calc(100% - 40px)'} mb={'1rem'} mt={'0.5rem'} borderRadius={'10px'} overflow={'hidden'}>
                <MarkdownEditor/>
            </Box>

        </VStack>
    )
}