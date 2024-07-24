type SiteEnv = "dev" | "staging" | "prod";


export const ENV: SiteEnv = "dev";

const BACKEND_URL_CONFIG: { [key in SiteEnv]: string } = {
    dev: "http://localhost:8000",
    staging: "https://staging.arbora.io",
    prod: "https://arbora.io"
}

export const BACKEND_URL: string = BACKEND_URL_CONFIG[ENV];

export const CONSOLE_LOG_VISIBILITY: { [key in SiteEnv]: boolean } = {
    dev: true,
    staging: true,
    prod: false
}
