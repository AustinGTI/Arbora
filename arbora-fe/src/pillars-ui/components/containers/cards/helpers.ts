import {CardVariant} from "./types.ts";

export function convertSimpleCardVariantToStyling(variant: CardVariant) {
    switch (variant) {
        case CardVariant.SHADOW:
            return {
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)"
            }
        case CardVariant.OUTLINE:
            return {
                border: "1px solid #E5E5E5"
            }
    }
}