import {Box, BoxProps} from "@chakra-ui/react";

interface PiDividerProps extends BoxProps {
    orientation: 'vertical' | 'horizontal'
    length?: string
    thickness?: string
}

export default function PiDivider({orientation, length = '100%', thickness = '3px', ...box_props}: PiDividerProps) {
    return (
        <Box
            w={orientation === 'horizontal' ? length : thickness}
            h={orientation === 'vertical' ? length : thickness}
            bg={'black'}
            {...box_props}/>
    )
}