import {Center, CenterProps} from "@chakra-ui/react";
import PiPlainText from "../../../pillars-ui/components/text/PiPlainText.tsx";
import PiDropdownButton from "../../../pillars-ui/components/buttons/modal-buttons/PiDropdownButton.tsx";
import useGlobalHomeState from "../../redux/home/hooks/useGlobalHomeState.tsx";
import NoteSelectionDropdown from "./NoteSelectionDropdown.tsx";
import {useDispatch} from "react-redux";
import React from "react";
import {setActiveNote} from "../../redux/home/home_slice.ts";
import {PiButtonVariant} from "../../../pillars-ui/components/buttons/types.ts";

interface ActiveDocumentNoteSelectorProps extends CenterProps {
    is_disabled?: boolean
}

export default function ActiveDocumentNoteSelector
({is_disabled, ...center_props}: ActiveDocumentNoteSelectorProps) {
    const {documents: {active_document, active_note}} = useGlobalHomeState()

    const dispatch = useDispatch()
    const setSelectedNote = React.useCallback((note_id: string | null) => {
        dispatch(setActiveNote(note_id))
    }, [dispatch]);

    return (
        <Center {...center_props}>
            {active_document ? (
                <PiDropdownButton
                    width={'300px'} isDisabled={is_disabled}
                    variant={PiButtonVariant.GHOST}
                    dropdown_container_props={{
                        w: 'match-button'
                    }}
                    dropdown_content={
                        <NoteSelectionDropdown
                            selected_note={active_note}
                            notes={active_document.notes} setSelectedNote={setSelectedNote}/>
                    }>
                    <PiPlainText value={active_note ? active_document.notes[active_note].title : 'Select a note...'}
                                 fontSize={'20px'}/>
                </PiDropdownButton>
            ) : (
                <PiPlainText value={'No document selected'} fontSize={'24px'}/>
            )}
        </Center>
    )
}
