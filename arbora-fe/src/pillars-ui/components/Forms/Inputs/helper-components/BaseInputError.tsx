import React from 'react'
import {HStack, Text, TextProps} from "@chakra-ui/react";

interface BaseErrorProps extends TextProps {
    error: string
}

export default function BaseInputError({error, ...text_props}: BaseErrorProps) {
    return (
        <HStack w={'100%'}>
            <Text color={'red'} fontSize={'10px'} lineHeight={'12px'} margin={0} padding={0} {...text_props}>{error}</Text>
        </HStack>
    )
}
