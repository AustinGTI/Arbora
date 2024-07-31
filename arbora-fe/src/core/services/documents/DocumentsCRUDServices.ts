import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {BACKEND_URL} from "../../constants/env.ts";
import {Document} from "./types.ts";
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
    return makeServiceCall<CreateDocumentServiceRequest,CreateDocumentServiceResponse>
    ({
        url: `${BACKEND_URL}/create-document`,
        method: "POST",
        request,
        service_name: "createDocumentService",
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
    return makeServiceCall<UpdateDocumentServiceRequest,UpdateDocumentServiceResponse>
    ({
        url: `${BACKEND_URL}/update-document`,
        method: "PUT",
        request,
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
        service_name: "deleteDocumentService",
        with_access_token: true
    })
}
