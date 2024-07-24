import React from 'react'
import {Box, BoxProps} from "@chakra-ui/react";

interface PiFormFieldsProps extends BoxProps {
    children: React.ReactNode
}


/**
 * a wrapper for a form's fields that provides a scrollable container for the fields that is restricted to a max height of 65vh
 * @param children
 * @param box_props
 * @constructor
 */
export default function PiFormFields({children, ...box_props}: PiFormFieldsProps) {
    return (
        <Box w={'100%'} h={'100%'} flex={1} p={'.5rem'} overflowY={'auto'} {...box_props}>
            {children}
        </Box>
    );
}
