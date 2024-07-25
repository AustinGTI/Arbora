import React from 'react'
import {CardVariant} from "./types";
import {Box, BoxProps} from "@chakra-ui/react";
import {convertSimpleCardVariantToStyling} from "./helpers";

export interface PiCardProps extends BoxProps {
    variant?: CardVariant
    children: React.ReactNode
}

export default function PiCard({children, variant = CardVariant.SHADOW, ...box_props}: PiCardProps) {
    const variant_styling: BoxProps = React.useMemo(() => {
        return convertSimpleCardVariantToStyling(variant)
    }, [variant]);

    return (
        <Box
            padding={15}
            borderRadius={10}
            bg={'white'}
            {...variant_styling}
            {...box_props}>
            {children}
        </Box>
    );
}
