import PiText, {PiTextProps} from "./PiText.tsx";
import {Tooltip} from "@chakra-ui/react";

export type PiPlainTextProps = {
    value?: string | number,
    casing?: 'uppercase' | 'lowercase' | 'capitalize'
    character_limit?: number
} & Omit<PiTextProps, 'value'>

export default function PiPlainText({value, casing, character_limit, ...base_props}: PiPlainTextProps) {
    let render_value = value?.toString();
    if (render_value) {
        switch (casing) {
            case 'uppercase':
                render_value = render_value.toUpperCase();
                break;
            case 'lowercase':
                render_value = render_value.toLowerCase();
                break;
            case 'capitalize':
                // first split the string into words
                const words = render_value.split(' ');
                // then capitalize each word and join them back
                render_value = words.map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');
                break;
            case undefined:
                break;
            default:
                // should never happen because of type checking
                console.error(`Invalid casing value: ${casing}`)
                break;
        }
        if (character_limit && render_value.length > character_limit) {
            return (
                <Tooltip label={render_value} placement={'top'}>
                    <span>
                        <PiText value={render_value.slice(0, character_limit) + '...'} casing={casing}
                                fontWeight={500} {...base_props}/>
                    </span>
                </Tooltip>
            )
        }
    }
    return (
        <PiText value={render_value} casing={casing} fontWeight={500} {...base_props}/>
    )
}
