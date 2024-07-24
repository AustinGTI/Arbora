import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {makeServiceCall} from "../helpers.ts";
import {BACKEND_URL} from "../../constants/env.ts";
import {User} from "./types.ts";

interface CreateUserServiceRequest extends GenericServiceRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}


/**
 * create a new user in the platform
 * @param request
 */
export async function createUserService(request: CreateUserServiceRequest): Promise<GenericServiceResponse> {
    return makeServiceCall<CreateUserServiceRequest>
    ({
        url: `${BACKEND_URL}/create-user`,
        method: "POST",
        request,
        service_name: "createUserService",
        with_access_token: false
    })
}

interface GetCurrentUserResponse extends GenericServiceResponseData {
    user: User
}

export async function getCurrentUserService(): Promise<GenericServiceResponse<GetCurrentUserResponse>> {
    return makeServiceCall<Object, GetCurrentUserResponse>
    ({
        url: `${BACKEND_URL}/get-user`,
        method: "GET",
        request: null,
        service_name: "getCurrentUserService",
        display_success_alert: false
    })
}