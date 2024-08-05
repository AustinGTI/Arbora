import {BACKEND_URL} from "../../constants/env.ts";
import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {makeServiceCall} from "../helpers.ts";
import {Folder} from "./types.ts";

interface ListFoldersServiceResponse extends GenericServiceResponseData {
    folders: Folder[]
}


/**
 * list available folders for the current user
 */
export async function listFoldersService(): Promise<GenericServiceResponse<ListFoldersServiceResponse>> {
    return makeServiceCall<Object, ListFoldersServiceResponse>
    ({
        url: `${BACKEND_URL}/list-folders`,
        method: "GET",
        request: null,
        service_name: "listFoldersService",
        with_access_token: true
    })
}


interface CreateFolderServiceRequest extends GenericServiceRequest {
    name: string
}

interface CreateFolderServiceResponse extends GenericServiceResponseData {}


/**
 * create a new folder
 */
export async function createFolderService(request: CreateFolderServiceRequest): Promise<GenericServiceResponse<CreateFolderServiceResponse>> {
    return makeServiceCall<CreateFolderServiceRequest, CreateFolderServiceResponse>
    ({
        url: `${BACKEND_URL}/create-folder`,
        method: "POST",
        request,
        service_name: "createFolderService",
        with_access_token: true
    })
}

interface UpdateFolderServiceRequest extends GenericServiceRequest {
    id: string
    name: string
}

interface UpdateFolderServiceResponse extends GenericServiceResponseData {}


/**
 * update a folder
 */
export async function updateFolderService(request: UpdateFolderServiceRequest): Promise<GenericServiceResponse<UpdateFolderServiceResponse>> {
    return makeServiceCall<UpdateFolderServiceRequest, UpdateFolderServiceResponse>
    ({
        url: `${BACKEND_URL}/update-folder`,
        method: "PUT",
        request,
        service_name: "updateFolderService",
        with_access_token: true
    })
}



interface DeleteFolderServiceRequest extends GenericServiceRequest {
    id: string
}

interface DeleteFolderServiceResponse extends GenericServiceResponseData {}


/**
 * delete a folder
 */
export async function deleteFolderService(request: DeleteFolderServiceRequest): Promise<GenericServiceResponse<DeleteFolderServiceResponse>> {
    return makeServiceCall<DeleteFolderServiceRequest, DeleteFolderServiceResponse>
    ({
        url: `${BACKEND_URL}/delete-folder`,
        method: "DELETE",
        request,
        service_name: "deleteFolderService",
        with_access_token: true
    })
}


interface AddDocumentToFolderServiceRequest extends GenericServiceRequest {
    folder_id: string
    document_id: string
}

interface AddDocumentToFolderServiceResponse extends GenericServiceResponseData {}

/**
 * add a document to a folder
 */
export async function addDocumentToFolderService(request: AddDocumentToFolderServiceRequest): Promise<GenericServiceResponse<AddDocumentToFolderServiceResponse>> {
    return makeServiceCall<AddDocumentToFolderServiceRequest, AddDocumentToFolderServiceResponse>
    ({
        url: `${BACKEND_URL}/add-document-to-folder`,
        method: "POST",
        request,
        service_name: "addDocumentToFolderService",
        with_access_token: true
    })
}
