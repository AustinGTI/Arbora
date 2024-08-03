import React from 'react';
import {HStack, StackProps} from "@chakra-ui/react";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiTextAreaInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextAreaInput.tsx";
import {generateRandomString} from "../../../../../../../core/helpers/strings.ts";

interface ChatMessageInputProps extends StackProps {
    is_disabled?: boolean
    setInputValue: (value: string) => void
    cancelResponse: () => void
}

export default function ChatMessageInput
({
     setInputValue, is_disabled, cancelResponse, ...stack_props
 }: ChatMessageInputProps) {
    // this is used to refresh the input field after a response is sent
    const [input_key, setInputKey] = React.useState<string>('random-string')

    const [input_text, setInputText] = React.useState<string>('')

    return (
        <HStack w={'100%'} p={'0.5rem'} {...stack_props}>
            <PiTextAreaInput
                key={input_key}
                width={'90%'}
                input_type={'generic'}
                isDisabled={is_disabled}
                onInputChange={(value) => setInputText(value)}
                placeholder={'Respond to Arby'}
                rows={3}/>
            {!is_disabled ? (
                <PiButton
                    label={'Send'}
                    isDisabled={input_text === ''}
                    onClick={() => {
                        setInputText('')
                        setInputKey(generateRandomString(5))
                        setInputValue(input_text)
                    }}/>
            ) : (
                <PiButton
                    label={'Stop'}
                    onClick={() => {
                        setInputText('')
                        cancelResponse()
                    }}/>
            )}
        </HStack>
    )
}