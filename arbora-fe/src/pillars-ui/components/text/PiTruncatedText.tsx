import React from 'react'
import {
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverProps,
    PopoverTrigger,
    Portal,
    Text
} from "@chakra-ui/react";
import './truncated_text.css'
import PiPlainText, {PiPlainTextProps} from "./PiPlainText.tsx";

type PiTruncatedTextProps = ({
        character_limit: number,
        label?: never
    } | {
        character_limit?: never
        label: string
    })
    & {
    in_portal?: boolean
    popover_props?: PopoverProps
} & PiPlainTextProps

export default function PiTruncatedText({
                                          character_limit = 50,
                                          label,
                                          value,
                                          placeholder,
                                          in_portal = false,
                                          popover_props,
                                          ...text_props
                                      }: PiTruncatedTextProps) {
    const original_value = (value ?? '').toString()

    const truncated_value = React.useMemo(() => {
        if (label) return label
        if (original_value && original_value.length > character_limit) {
            return original_value.substring(0, character_limit) + '...'
        }
        return original_value
    }, [original_value, character_limit, label])

    const content = React.useMemo(() => {
        return (
            <PopoverContent className={'popover-content-leta-ui'} border={'1px solid #ddd'}
                            _focusVisible={{boxShadow: 'none'}} zIndex={'1000 !important'}>
                <PopoverArrow/>
                <PopoverBody zIndex={1000}>
                    <Text>{original_value}</Text>
                </PopoverBody>
            </PopoverContent>
        )
    }, [original_value]);

    return (
        original_value !== truncated_value ?
            <Popover
                placement={'bottom'} {...popover_props}>
                <PopoverTrigger>
                    <Text cursor={'pointer'} _hover={{textDecoration: 'underline'}} {...text_props}>
                        {truncated_value}
                    </Text>
                </PopoverTrigger>
                {in_portal ? <Portal>{content}</Portal> : content}
            </Popover> :
            <PiPlainText value={truncated_value} placeholder={placeholder} {...text_props}/>
    )
}