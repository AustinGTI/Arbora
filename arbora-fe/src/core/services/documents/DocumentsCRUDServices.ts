import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {BACKEND_URL} from "../../constants/env.ts";
import {Document, NoteReviewType} from "./types.ts";
import {makeServiceCall} from "../helpers.ts";

interface ListDocumentsServiceResponse extends GenericServiceResponseData {
    documents: Document[]
}

/**
 * list all available documents for the current user
 */
export async function listDocumentsService(): Promise<GenericServiceResponse<ListDocumentsServiceResponse>> {
    return makeServiceCall<Object, ListDocumentsServiceResponse>
    ({
        url: `${BACKEND_URL}/list-documents`,
        method: "GET",
        request: null,
        service_name: "listDocumentsService",
        with_access_token: true
    })
}


interface CreateDocumentServiceRequest extends GenericServiceRequest {
    content: string
}

interface CreateDocumentServiceResponse extends GenericServiceResponseData {
    document?: Document
}

/**
 * create a new document
 */
export async function createDocumentService(request: CreateDocumentServiceRequest): Promise<GenericServiceResponse<CreateDocumentServiceResponse>> {
    return makeServiceCall<CreateDocumentServiceRequest, CreateDocumentServiceResponse>
    ({
        url: `${BACKEND_URL}/create-document`,
        method: "POST",
        request,
        service_name: "createDocumentService",
        display_success_alert: true,
        display_error_alert: true,
        success_message: 'Document created successfully',
        with_access_token: true
    })
}


interface UpdateDocumentServiceRequest extends GenericServiceRequest {
    id: string
    content: string
}

interface UpdateDocumentServiceResponse extends GenericServiceResponseData {
    document: Document
}

/**
 * update an existing document
 */
export async function updateDocumentService(request: UpdateDocumentServiceRequest): Promise<GenericServiceResponse<UpdateDocumentServiceResponse>> {
    return makeServiceCall<UpdateDocumentServiceRequest, UpdateDocumentServiceResponse>
    ({
        url: `${BACKEND_URL}/update-document`,
        method: "PUT",
        request,
        display_success_alert: true,
        display_error_alert: true,
        success_message: 'Document updated successfully',
        service_name: "updateDocumentService",
        with_access_token: true
    })
}

interface DeleteDocumentServiceRequest extends GenericServiceRequest {
    id: string
}

/**
 * delete an existing document
 */
export async function deleteDocumentService(request: DeleteDocumentServiceRequest): Promise<GenericServiceResponse> {
    return makeServiceCall<Object>
    ({
        url: `${BACKEND_URL}/delete-document`,
        method: "DELETE",
        request: request,
        display_success_alert: true,
        display_error_alert: true,
        success_message: 'Document deleted successfully',
        service_name: "deleteDocumentService",
        with_access_token: true
    })
}

interface RecordNoteReviewServiceRequest extends GenericServiceRequest {
    document_id: string
    note_id: string
    review_type: NoteReviewType
    score: number
}

/**
 * record a review for a note
 */
export async function recordNoteReviewService(request: RecordNoteReviewServiceRequest): Promise<GenericServiceResponse> {
    return makeServiceCall<RecordNoteReviewServiceRequest>
    ({
        url: `${BACKEND_URL}/record-note-review`,
        method: "POST",
        request: request,
        display_success_alert: true,
        display_error_alert: true,
        success_message: 'Session recorded successfully',
        service_name: "recordNoteReviewService",
        with_access_token: true
    })
}
