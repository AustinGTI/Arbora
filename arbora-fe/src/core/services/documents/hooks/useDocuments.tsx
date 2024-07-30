import React from "react";
import {listDocumentsService} from "../DocumentsCRUDServices.ts";
import {Document} from "../types.ts";

interface UseDocumentsResponse {
    documents: Document[]
    documents_loading: boolean
    reloadDocuments: () => void
}

export default function useDocuments(): UseDocumentsResponse {
    const [documents, setDocuments] = React.useState<Document[]>([])
    const [documents_loading, setDocumentsLoading] = React.useState<boolean>(true)
    const [reload_state, reloadDocuments] = React.useReducer((state: boolean) => !state, false)

    React.useEffect(() => {
        // list all documents
        setDocumentsLoading(true)
        listDocumentsService().then((response) => {
            if (response.is_successful) {
                setDocuments(response.data?.documents || [])
            }
        }).finally(() => {
            setDocumentsLoading(false)
        })
    }, [reload_state]);

    return {
        documents,
        documents_loading,
        reloadDocuments
    }
}