import successIcon from '../../assets/alerts/success_icon.png'
import errorIcon from '../../assets/alerts/error_icon.png'
import warningIcon from '../../assets/alerts/warning_icon.png'
import infoIcon from '../../assets/alerts/info_icon.png'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertTypeSpecification {
    title: string,
    icon: string,
    color: string
}

export const ALERT_TYPES: { [type: string]: AlertTypeSpecification } = {
    success: {
        title: 'Success',
        icon: successIcon,
        color: 'green'
    },
    error: {
        title: "Error",
        icon: errorIcon,
        color: 'red'
    },
    warning: {
        title: "Warning",
        icon: warningIcon,
        color: 'yellow'
    },
    info: {
        title: "Info",
        icon: infoIcon,
        color: 'blue'
    }
} // todo: set more accurate colors

export const ALERT_MODAL_ID = 'alert-modal-container'
export const ALERT_ID = 'alert-container'
