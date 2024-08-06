import {InputVariant} from "../types";
import {InputProps} from "@chakra-ui/react";
import {ARBORA_GREEN} from "../../../../../core/constants/styling.ts";

export function inputVariantToTextInputStyling(variant: InputVariant): InputProps {
    switch (variant) {
        case InputVariant.CLASSIC:
            return {
                borderRadius: '3px'
            }
        case InputVariant.ROUNDED:
            return {
                borderRadius: '10px',
                borderWidth: '2px',
                borderColor: ARBORA_GREEN.hard,
                fontSize: '13px'
            }
        default:
            throw new Error(`Unknown input variant: ${variant}`)
    }
}