import {Text, TextProps} from "@chakra-ui/react";

export type PiTextProps = {
    value?: string, // either the value is a string or there is no value
    placeholder?: string,
} & TextProps

export default function PiText({value, placeholder = '-', ...text_props}: PiTextProps) {
    return (
        <Text {...text_props}>
            {value || placeholder}
        </Text>
    )
}