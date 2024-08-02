import {Document} from "../../services/documents/types.ts";
import {createSlice} from "@reduxjs/toolkit";
import {generateRandomString} from "../../helpers/strings.ts";

export enum DocumentViewTabKey {
    EDITOR = 'editor',
    FLASH_CARDS = 'flash_cards',
    QA = 'qa',
    EXPLAIN = 'explain'
}

export interface GlobalHomeState {
    documents: {
        documents: Document[]
        active_document: Document | null
        active_note: string | null

        reload_state: string
    },
    document_view: {
        collapsed: boolean
        active_tab: DocumentViewTabKey
        tab_data: {
            editor_data: {
                editable: boolean
                content: string
            }
            flash_cards_data: any
            qa_data: any
            explain_data: any
        }
    }
}

const initial_state: GlobalHomeState = {
    documents: {
        documents: [],
        active_document: null,
        active_note: null,

        reload_state: 'reload.88088.site',
    },
    document_view: {
        collapsed: false,
        active_tab: DocumentViewTabKey.EDITOR,
        tab_data: {
            editor_data: {
                editable: false,
                content: ''
            },
            flash_cards_data: null,
            qa_data: null,
            explain_data: null
        }
    }
}

export const HomeSlice = createSlice({
    name: 'home',
    initialState: initial_state,
    reducers: {
        setDocuments: (state, action: { payload: Document[] }) => {
            state.documents.documents = action.payload
        },
        setActiveDocument: (state, action: { payload: Document | null }) => {
            state.documents.active_document = action.payload
        },
        setActiveNote: (state, action: { payload: string | null }) => {
            state.documents.active_note = action.payload
        },
        setActiveTab: (state, action: { payload: DocumentViewTabKey }) => {
            state.document_view.active_tab = action.payload
        },
        reloadHomeData: (state, action: { payload: { with_note_reset?: boolean, with_site_reload?: boolean } }) => {
            state.documents.reload_state = 'reload.' + generateRandomString(5)
            if (action.payload.with_note_reset) {
                state.documents.active_note = null
            }
            if (action.payload.with_site_reload) {
                state.documents.reload_state += '.site'
            }
        },
        collapseDocumentView: (state, action: { payload: boolean }) => {
            state.document_view.collapsed = action.payload
        },

        setEditorEditable: (state, action: { payload: boolean }) => {
            state.document_view.tab_data.editor_data.editable = action.payload
        },

        setEditorContent: (state, action: { payload: string }) => {
            state.document_view.tab_data.editor_data.content = action.payload
        }
    }
})

export const {
    setDocuments,
    setActiveDocument,
    setActiveNote,
    setActiveTab,
    reloadHomeData,
    collapseDocumentView,
    setEditorEditable,
    setEditorContent
} = HomeSlice.actions