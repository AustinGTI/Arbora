import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {makeServiceCall} from "../helpers.ts";
import {BACKEND_URL} from "../../constants/env.ts";
import {setAccessToken, setRefreshToken} from "../../redux/auth/auth_slice.ts";
import {store} from "../../redux";

interface LoginServiceRequest extends GenericServiceRequest {
    email: string;
    password: string;
}

interface LoginServiceResponse extends GenericServiceResponseData {
    access_token: string;
    refresh_token: string;
}

/**
 * log a user into the platform given their email and password and return the access token and refresh token
 * @param request
 */
export async function loginService(request: LoginServiceRequest): Promise<GenericServiceResponse<LoginServiceResponse>> {
    const response = await makeServiceCall<LoginServiceRequest, LoginServiceResponse>
    ({
        url: `${BACKEND_URL}/login`,
        method: "POST",
        request,
        service_name: "loginService",
        with_access_token: false
    })
    // set the access token and refresh token if the login was successful
    if (response.is_successful && response.data) {
        store.dispatch(setAccessToken(response.data?.access_token))
        store.dispatch(setRefreshToken(response.data?.refresh_token))
    }
    return response
}

interface RefreshAccessTokenResponse extends GenericServiceResponseData {
    access_token: string;
}

export async function refreshAccessTokenService(): Promise<GenericServiceResponse<RefreshAccessTokenResponse>> {
    const response = await makeServiceCall<Object, RefreshAccessTokenResponse>
    ({
        url: `${BACKEND_URL}/refresh_token`,
        method: "GET",
        request: null,
        service_name: "refreshAccessTokenService",
        display_error_alert: false
    })
    // set the new access token if the refresh was successful
    if (response.is_successful && response.data) {
        store.dispatch(setAccessToken(response.data.access_token))
    }
    return response
}