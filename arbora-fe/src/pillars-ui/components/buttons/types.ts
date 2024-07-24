import {ButtonProps, IconProps} from "@chakra-ui/react";
import React from "react";
import {IconType} from "react-icons";


export type ButtonPalette = {
    primary: string
    secondary: string
    hover: string
}

export enum PiButtonIcon {
    ADD = 'add',
    EDIT = 'edit',
    DELETE = 'delete',
    VIEW = 'view',
    SAVE = 'save',
    CLOSE = 'close',
    OPTIONS = 'options',
    DOWNLOAD = 'download',
    UPLOAD = 'upload',
    SETTINGS = 'settings',
    LONG_RIGHT_ARROW = 'long-right-arrow',
    LONG_LEFT_ARROW = 'long-left-arrow',
    SWAP = 'swap',
}

export enum PiButtonVariant {
    SOLID = "solid",
    OUTLINE = "outline",
    GHOST = "ghost",
    LINK = "link",
    TABLE_LINK = "table-link",
    ICON_CLASSIC = "icon-classic",
    ICON = 'icon',
    SOFT_OUTLINE = "soft-outline",
}

export enum PiButtonPalette {
    BLACK_WHITE = "black-white",
    RED_WHITE = "red-white",
    GREEN_WHITE = "green-white",
    GRAY_WHITE = "gray-white",
    ORANGE_WHITE = "orange-white",
    BLUE_WHITE = "blue-white",
}


export type ButtonTooltipProps = {
    /**
     * if set to true, the button will have a tooltip, is required for tooltip_label to be displayed
     */
    with_tooltip?: boolean
    /**
     * the text to be displayed in the tooltip
     */
    tooltip_label?: string,
    /**
     * the placement of the tooltip
     */
    tooltip_placement?: "top" | "bottom" | "left" | "right"
}

export type ButtonConfirmationProps = {
    /**
     * if set to true, the button will have a confirmation dialog, is required for confirmation_title and confirmation_message to be displayed
     */
    with_confirmation?: boolean,
    /**
     * the title of the confirmation dialog
     */
    confirmation_title?: string,
    /**
     * the message of the confirmation dialog
     */
    confirmation_message?: string
}

export type ButtonStylingProps = {
    /**
     * the variant of the button which is used to determine the styling of the button,
     * a set of default stylings have already been defined in the PiButtonVariant enum.
     * ! you can add more but remember to add the new variant as a case in the variantToStylingProps function and set up the styling props for it
     */
    variant?: PiButtonVariant,
    /**
     * a prop that determines the coloring of the button,
     * a set of default palettes have already been defined in the PiButtonPalette enum.
     * ! you can add more but remember to configure the new palette in the relevant functions in helpers.tsx
     */
    palette?: PiButtonPalette,
    /**
     * a prop that determines the position of the icon in the button, accepts 'left' or 'right'
     */
    icon_position?: "left" | "right",

    /**
     * props passed to the icon component of the button
     */
    icon_props?: IconProps
}

export type ButtonOnClickFunction = (setButtonLoadingState: (state: boolean) => void) => void | Promise<void>

export type ButtonActionProps = {
    /**
     * the function that is called when the button is clicked, the function can be async and a function to set the loading state of the button is passed as a parameter
     */
    onClick?: ButtonOnClickFunction
}
export type ButtonContentProps = {
    /**
     * The text to be displayed on the button
     */
    label?: string,
    /**
     * The icon to be displayed on the button, can be an IconType component or a PiButtonIcon
     * where PiButtonIcon is a string enum of the common icons, add more icons to the enum if required
     */
    icon?: IconType | PiButtonIcon,
    /**
     * The components to be rendered within the button object, if available, takes precedence over text and icon
     */
    children?: React.ReactNode
}


export type GenericButtonProps = (
    ButtonContentProps
    & ButtonStylingProps
    & ButtonTooltipProps
    & ButtonConfirmationProps
    & Omit<ButtonProps, "onClick">
    )

