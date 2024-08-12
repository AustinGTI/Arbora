import React from "react";
import {listDocumentsService} from "../DocumentsCRUDServices.ts";
import {Document} from "../types.ts";
import {useDispatch} from "react-redux";
import {setActiveDocument, setActiveNote, setDocuments} from "../../../redux/home/home_slice.ts";
import useGlobalHomeState from "../../../redux/home/hooks/useGlobalHomeState.tsx";


interface UseDocumentsResponse {
    documents: Document[]
    documents_loading: boolean
}

export default function useDocuments(): UseDocumentsResponse {
    const [documents_loading, setDocumentsLoading] = React.useState<boolean>(true)

    const {documents: {documents, reload_state, active_document, active_note}} = useGlobalHomeState()
    const dispatch = useDispatch()

    React.useEffect(() => {
        if (reload_state.includes('.site')) {
            setDocumentsLoading(true)
        }
        listDocumentsService().then((response) => {
            if (response.is_successful) {
                dispatch(setDocuments(response.data?.documents || []))
                // check if the active document is still in the list and update it
                if (active_document) {
                    const updated_active_document = response.data?.documents?.find((document) => document.id === active_document.id)
                    if (!updated_active_document) {
                        dispatch(setActiveDocument(null))
                    } else {
                        // if .note is not in the reload_state and the original active note is still in the document, set it to the active note
                        dispatch(setActiveDocument(updated_active_document))
                        if (reload_state.includes('.note') && active_note && updated_active_document.notes[active_note]) {
                            dispatch(setActiveNote(active_note))
                        }
                    }
                }
            }
        }).finally(() => {
            setDocumentsLoading(false)
        })
    }, [reload_state]);

    return {
        documents,
        documents_loading,
    }
}