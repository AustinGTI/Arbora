import React from 'react';
import useCountdownTimer from "../../../../../../core/helpers/hooks/useCountdownTimer.tsx";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import {
    createDocumentService, deleteDocumentService,
    updateDocumentService
} from "../../../../../../core/services/documents/DocumentsCRUDServices.ts";
import {reloadHomeData, setActiveDocument} from "../../../../../../core/redux/home/home_slice.ts";
import {ButtonOnClickFunction, PiButtonIcon} from "../../../../../../pillars-ui/components/buttons/types.ts";
import {Box, HStack, VStack} from "@chakra-ui/react";
import PiButton from "../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {MarkdownEditor} from "../../../../../../core/markdown/MarkdownEditor.tsx";

const AUTOSAVE_INTERVAL_IN_S = 10
export default function DocumentViewEditorTab() {
    const {
        documents: {active_document},
        document_view: {
            tab_data: {editor_data: {content}}
        }
    } = useGlobalHomeState()
    const dispatch = useDispatch()

    // region CRUD FUNCTIONS
    // ? ........................

    const updateActiveDocument = React.useCallback(async (new_content: string) => {
        // check if there is an active document
        if (!active_document) {
            StandardConsole.warn('No active document to update')
            return
        }
        updateDocumentService({
            id: active_document.id,
            content: new_content
        }).then((response) => {
            if (response.is_successful) {
                dispatch(reloadHomeData({with_note_reset: true}))
            }
        })
    }, [active_document, dispatch]);

    const createNewDocument: ButtonOnClickFunction = React.useCallback(async (setButtonLoadingState) => {
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
        setButtonLoadingState(true)
        await createDocumentService({
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
        setButtonLoadingState(false)
    }, [active_document, dispatch, content]);

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
                dispatch(reloadHomeData({with_note_reset: true}))
            }
        })
        setButtonLoadingState(false)
    }, [active_document, dispatch]);


    // ? ........................
    // endregion ........................

    // region AUTO SAVE ACTIVE DOCUMENT
    // ? ........................

    const {t: t_minus_autosave, setTimer} = useCountdownTimer()
    React.useEffect(() => {
        if (t_minus_autosave === 1000 && active_document) {
            if (content) {
                updateActiveDocument(content).then()
            }
            setTimer(AUTOSAVE_INTERVAL_IN_S)
        }
    }, [t_minus_autosave, active_document]);

    // ? ........................
    // endregion ........................

    return (
    <VStack w={'100%'} h={'100%'} px={'1rem'}>
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
                            dispatch(setActiveDocument(null))
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
            <MarkdownEditor/>
        </Box>

    </VStack>
    )
}