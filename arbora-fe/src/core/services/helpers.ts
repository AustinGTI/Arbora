import {GenericServiceResponse, GenericServiceResponseData, RequestMethod} from "./types.ts";
import {StandardConsole} from "../helpers/logging.ts";
import {getAccessToken} from "../redux/auth/helpers.ts";
import {refreshAccessTokenService} from "./auth/AuthServices.ts";
import {showErrorAlert, showSuccessAlert} from "../../pillars-ui/components/alerts/display_functions.tsx";

interface MakeServiceCallParams<Request extends Object> {
    url: string;
    method: RequestMethod;
    request: Request | null;
    service_name: string;
    with_access_token?: boolean;
    log_request?: boolean;
    log_response?: boolean;
    display_success_alert?: boolean;
    success_message?: string;
    display_error_alert?: boolean;
}


function logServiceRequest(service_name: string, request: Object | null) {
    StandardConsole.log(
        '%c[REQUEST]%c %s: ',
        'background: black; color: #90EE90;', // Light green for request
        'background: black; color: #D3D3D3;', // Light gray for service name
        service_name,
        request
    );
}

function logServiceResponse(service_name: string, response: Object, error?: boolean) {
    const logType = error ? 'ERROR' : 'RESPONSE';
    const logColor = error ? '#FFA07A' : '#87CEFA'; // Light red for error, light blue for response

    StandardConsole.log(
        `%c[${logType}]%c %s: `,
        `background: black; color: ${logColor};`,
        'background: black; color: #D3D3D3;', // Light gray for service name
        service_name,
        response
    );
}


export async function makeServiceCall<Request extends Object, Response extends GenericServiceResponseData = GenericServiceResponseData>
({
     url, method, request, service_name,
     with_access_token = true, log_request = true, log_response = true,
     display_error_alert = true, display_success_alert = false, success_message
 }: MakeServiceCallParams<Request>): Promise<GenericServiceResponse<Response>> {
    if (log_request) {
        logServiceRequest(service_name, request);
    }

    let response = null
    try {
        response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': with_access_token ? `Bearer ${getAccessToken()}` : ''
            },
            body: request ? JSON.stringify(request) : undefined
        });
    } catch (e) {
        StandardConsole.error('Error occurred while making service call: ', e)
        return {
            data: null,
            is_successful: false,
            error_message: 'An error occurred while making the service call: ' + e
        }
    }

    // if the status code is 401, it likely means the access token has expired, if so, we need to refresh the access token
    if ((response.status === 401 || response.status === 403) && with_access_token) {
        // refresh the access token
        // if the refresh token is also expired, then we need to log the user out
        const refresh_response = await refreshAccessTokenService();
        if (refresh_response.is_successful) {
            // access token has been refreshed, we can retry the service call
            response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': with_access_token ? `Bearer ${getAccessToken()}` : ''
                },
                body: request ? JSON.stringify(request) : undefined
            });
        } else {
            // refresh token has also expired, log the user out
            StandardConsole.warn('Refresh token has expired, logging out user')
            window.location.href = '/logout';
        }
    }

    const response_json = await response.json();

    if (log_response) {
        logServiceResponse(service_name, response_json, !response.ok);
    }

    if ((!response.ok || !response_json.is_successful) && display_error_alert) {
        // todo: make this message customizable
        showErrorAlert(response_json.message ?? 'An error occurred')
    }

    if (response.ok && response_json.is_successful && display_success_alert) {
        showSuccessAlert(success_message ?? response_json.message ?? 'Success')
    }


    return {
        data: response.ok ? response_json : null,
        is_successful: response.ok && response_json.is_successful,
        error_message: response_json?.message ?? ''
    };
}