import React from 'react';
import {BoxProps, HStack} from "@chakra-ui/react";
import SubmitButton from "../helper_components/SubmitButton";
import ResetButton from "../helper_components/ResetButton";
import CancelButton from "../helper_components/CancelButton";

interface BaseFormFooterProps extends BoxProps {
    submit_button_text?: string
    with_reset_button?: boolean
    cancelFunction?: () => void
}

export default function BaseFormFooter
({
     submit_button_text, with_reset_button, cancelFunction, ...box_props
 }: BaseFormFooterProps) {
    return (
        <HStack w={'100%'} justifyContent={'flex-end'} py={'.5rem'} {...box_props}>
            {cancelFunction && <CancelButton onClick={cancelFunction}/>}
            {with_reset_button && <ResetButton/>}
            <SubmitButton label={submit_button_text ?? "Submit"}/>
        </HStack>
    )
}