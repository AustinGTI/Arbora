import {InputVariant} from "../types";
import {InputProps} from "@chakra-ui/react";

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
                borderColor: 'green.500',
                fontSize: '13px'
            }
        default:
            throw new Error(`Unknown input variant: ${variant}`)
    }
}