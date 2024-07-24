import {BACKEND_URL, ENV} from "./env.ts";

export function prependBackendURL(path: string): string {
    // if path starts with a slash, remove it
    if (path.startsWith("/")) {
        path = path.slice(1)
    }
    return `${BACKEND_URL[ENV]}/${path}`
}