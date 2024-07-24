import React from 'react'
import {HStack, StackProps, Text, TextProps} from "@chakra-ui/react";

interface BaseFormSubHeadingProps extends StackProps {
    heading: string
    lvl?: 1 | 2 | 3
    text_props?: TextProps
}

export default function BaseFormSubHeading
({
     heading, lvl = 2, text_props, ...container_props
 }: BaseFormSubHeadingProps) {
    return (
        <HStack w={'100%'} py={`${1 / (lvl / 2)}rem`} {...container_props}>
            <Text fontSize={`${18 - (2 * (lvl - 1))}px`} fontWeight={500} {...text_props}>
                {heading}
            </Text>
        </HStack>
    );
}
