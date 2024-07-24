import {store} from "../index.tsx";

export function getAccessToken(): string {
    return store.getState().auth.access_token;
}

export function getRefreshToken(): string {
    return store.getState().auth.refresh_token;
}