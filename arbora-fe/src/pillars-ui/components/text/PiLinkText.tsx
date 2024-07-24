import React from 'react'
import PiText from "./PiText.tsx";
import {Link} from "react-router-dom";

type PiLinkTextProps = {
    value: string | undefined,
    link: string,
} & Omit<React.ComponentProps<typeof PiText>, 'value'>

export default function PiLinkText({value, link, ...base_props}: PiLinkTextProps) {
    const string_is_valid = React.useMemo(() => value && value.trim().length > 0, [value])
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!string_is_valid) {
            event.preventDefault()
        }
    }, [string_is_valid])

    return (
        <Link to={link}
              onClick={handleClick}
              style={{
                  width: '100%', padding: 0, margin: 0,
                  userSelect: 'none', cursor: 'pointer'
              }}>
            <PiText
                // onClick={handleClick}
                cursor={string_is_valid ? 'pointer' : 'default'}
                _hover={string_is_valid ? {textDecoration: 'underline'} : undefined}
                value={value}
                {...base_props}
            />
        </Link>
    )
}