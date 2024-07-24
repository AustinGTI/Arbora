import React from 'react'
import PiText from "./PiText.tsx";

export type PiPlainTextProps = {
    value?: string | number,
    casing?: 'uppercase' | 'lowercase' | 'capitalize'
} & Omit<React.ComponentProps<typeof PiText>, 'value'>

export default function PiPlainText({value, casing, ...base_props}: PiPlainTextProps) {
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
    }
    return (
        <PiText value={render_value} casing={casing} {...base_props}/>
    )
}
