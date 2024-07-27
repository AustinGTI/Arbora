import {Text, TextProps} from "@chakra-ui/react";

export type PiTextProps = {
    value?: string, // either the text is a string or there is no text
    placeholder?: string,
} & TextProps

export default function PiText({value, placeholder = '-', ...text_props}: PiTextProps) {
    return (
        <Text {...text_props}>
            {value || placeholder}
        </Text>
    )
}