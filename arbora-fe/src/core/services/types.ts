export interface GenericServiceRequest {
}


export interface GenericServiceResponse<ResponseData extends GenericServiceResponseData = GenericServiceResponseData> {
    data: ResponseData | null;
    is_successful: boolean;
    error_message: string
}

export interface GenericServiceResponseData {
    is_successful: boolean;
    message?: string;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
