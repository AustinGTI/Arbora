import PiAlert from "./PiAlert.tsx";
import React from "react";
import {createRoot, Root} from "react-dom/client";
import BaseConfirmationAlert from "./BaseConfirmationAlert.tsx";
import {ALERT_ROOT_ID} from "../../index.tsx";
import {StandardConsole} from "../../../core/helpers/logging.ts";
import {AlertType} from "./types.ts";


let alert_root: Root | null = null

export function showPiAlert(type: AlertType, message: string, callback?: () => void, duration?: number) {
    const alert_root_box = document.getElementById(ALERT_ROOT_ID)
    if (!alert_root_box) {
        console.error('alert root box not found, cannot display error')
        return
    }

    const alert = React.createElement(PiAlert, {key: Math.random(), type, message, callback, duration})

    // if the alert is not placed within a container, it will replace the entire page
    if (!alert_root) {
        alert_root = createRoot(alert_root_box)
    }
    StandardConsole.log('rendering from root', alert_root)
    alert_root.render(alert)
}

export function showSuccessAlert(message: string, callback?: () => void, duration?: number) {
    showPiAlert('success', message, callback, duration)
}

export function showErrorAlert(message: string, callback?: () => void, duration?: number) {
    showPiAlert('error', message, callback, duration)
}

export function showConfirmationAlert(message: string, handleYes: () => void, handleNo: () => void) {
    const alert_root_box = document.getElementById(ALERT_ROOT_ID)
    if (!alert_root_box) {
        console.error('alert root box not found, cannot display error')
        return
    }

    const alert = React.createElement(BaseConfirmationAlert, {key: Math.random(), message, handleYes, handleNo})

    // if the alert is not placed within a container, it will replace the entire page
    if (!alert_root) {
        alert_root = createRoot(alert_root_box)
    }
    alert_root.render(alert)
}