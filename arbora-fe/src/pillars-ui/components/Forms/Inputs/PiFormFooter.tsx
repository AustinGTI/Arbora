import {BoxProps, HStack} from "@chakra-ui/react";
import PiFormSubmitButton from "../helper_components/PiFormSubmitButton.tsx";
import ResetButton from "../helper_components/ResetButton";
import CancelButton from "../helper_components/CancelButton";

interface PiFormFooterProps extends BoxProps {
    submit_button_text?: string
    with_reset_button?: boolean
    cancelFunction?: () => void
}

export default function PiFormFooter
({
     submit_button_text, with_reset_button, cancelFunction, ...box_props
 }: PiFormFooterProps) {
    return (
        <HStack w={'100%'} justifyContent={'flex-end'} py={'.5rem'} {...box_props}>
            {cancelFunction && <CancelButton onClick={cancelFunction}/>}
            {with_reset_button && <ResetButton/>}
            <PiFormSubmitButton label={submit_button_text ?? "Submit"}/>
        </HStack>
    )
}