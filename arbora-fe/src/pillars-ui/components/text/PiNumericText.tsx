import React from 'react'
import PiText from "./PiText.tsx";
import {formatNumberWithCommas} from "../utils/helpers/parsing.ts";

export type PiNumericTextProps = {
    value?: number,
    dp?: number,
    suffix?: string,
    /**
     * whether or not to insert commas in the number between the thousands
     */
    insert_commas?: boolean,
    is_percentage?: boolean
} & Omit<React.ComponentProps<typeof PiText>, 'value'>

export default function PiNumericText({
                                          value,
                                          dp = 0,
                                          prefix = '',
                                          suffix = '',
                                          insert_commas = true,
                                          is_percentage = false,
                                          ...base_props
                                      }: PiNumericTextProps) {
    // if percentage and dp is 0, round the value up
    if (value && is_percentage && dp === 0) {
        value = Math.ceil(value)
    }
    // if render value is not undefined, then round it to the specified decimal places and separate the thousands before the
    // decimal point
    let render_value = value !== undefined ?
        insert_commas ? formatNumberWithCommas(value.toFixed(dp)) : value.toFixed(dp) : undefined;
    if (render_value) {
        if (prefix) {
            render_value = `${prefix} ${render_value}`
        }
        if (is_percentage) {
            render_value += '%'
        } else if (suffix) {
            render_value += ` ${suffix}`
        }
    }
    return (
        <PiText value={render_value} {...base_props}/>
    )
}

