import React from 'react';
import {Box} from "@chakra-ui/react";


export const PORTAL_BOX_ID = 'portal-box';
export const ALERT_ROOT_ID = 'alert-root';

interface PillarsProps {
    children: React.ReactNode
}

/**
 * The Pillars component is the root component of the Pillars UI library.
 * For best use, wrap the entire web application in this component before using any other PillarsUI components
 * Most components will still work without this component but some may not work as expected
 * @param children
 * @constructor
 */
export default function Pillars({children}: PillarsProps) {

    return (
        <Box>
            <Box id={PORTAL_BOX_ID} position={'absolute'} top={0} left={0}/>
            <Box id={ALERT_ROOT_ID} position={'absolute'} top={0} right={0}/>
            {children}
        </Box>
    )
}