import {Document} from "../../services/documents/types.ts";
import {createSlice} from "@reduxjs/toolkit";
import {generateRandomString} from "../../helpers/strings.ts";
import {RectProps} from "../../types.ts";

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
    },
    all_documents_view: {
        canvas_loading: boolean
        canvas_interactive: boolean
        // negative for backwards, positive for forwards, 0 for stop
        canvas_motion: number

        canvas_box_rect: RectProps | null
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
        collapsed: true,
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
    },
    all_documents_view: {
        canvas_loading: true,
        canvas_interactive: true,
        canvas_motion: -1,
        canvas_box_rect: null,
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
        },

        setCanvasLoadingState: (state, action: { payload: boolean }) => {
            state.all_documents_view.canvas_loading = action.payload
        },
        setCanvasBoxRect: (state, action: { payload: RectProps }) => {
            state.all_documents_view.canvas_box_rect = action.payload
        },
        setCanvasMotion: (state, action: { payload: number }) => {
            state.all_documents_view.canvas_motion = action.payload
        },
        setCanvasInteractivity: (state, action: { payload: boolean }) => {
            state.all_documents_view.canvas_interactive = action.payload
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
    setEditorContent,
    setCanvasLoadingState,
    setCanvasBoxRect,
    setCanvasMotion,
    setCanvasInteractivity
} = HomeSlice.actions