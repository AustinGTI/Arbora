import {CONSOLE_LOG_VISIBILITY, ENV} from "../constants/env.ts";

type LogType = "log" | "warn" | "error";

function logToConsole(message: any[], type: LogType = "log") {
    const log_visibility = CONSOLE_LOG_VISIBILITY[ENV];
    if (log_visibility) {
        console[type](...message);
    }
}

export const StandardConsole = {
    log: (...message: any[]) => logToConsole(message, "log"),
    warn: (...message: any[]) => logToConsole(message, "warn"),
    error: (...message: any[]) => logToConsole(message, "error")
}
