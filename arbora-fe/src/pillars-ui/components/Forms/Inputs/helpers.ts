import {InputDimensionSpecifications, InputVariant} from "./types";
import {PageVariant} from "../../Pages/types";

export const DEFAULT_INPUT_DIMENSIONS: InputDimensionSpecifications = {
    width: '100%',
    height: '40px',
}

/**
 * this is used in the situation where the input variant for an input component is not set,
 * in that case the page variant is inherited by the input variant
 * @param page_variant
 */
export function pageVariantToDefaultInputVariant(page_variant: PageVariant): InputVariant {
    switch (page_variant) {
        case PageVariant.ORIGINAL:
            return InputVariant.ORIGINAL
        case PageVariant.IFYS_V2:
            return InputVariant.IFYS_V2
    }
}
