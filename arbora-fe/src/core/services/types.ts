export interface GenericServiceRequest {
}


export type GenericServiceResponse<ResponseData extends GenericServiceResponseData = GenericServiceResponseData> = ({
    data: null;
    is_successful: false;
    error_message: string
} | {
    data: ResponseData;
    is_successful: true,
    error_message: string
})

export interface GenericServiceResponseData {
    is_successful: boolean;
    message?: string;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
