import React from "react";
import {HStack, Input, InputGroup, InputProps, InputRightElement, VStack} from "@chakra-ui/react";
import {InputSpecifications, InputVariant} from "../types";
import useFormControllerConditionally from "../../hooks/useFormControls";
import {inputVariantToTextInputStyling} from "./helpers";
import {TextOption} from "./types";
import {BiChevronDown} from "react-icons/bi";
import {mergeRefs} from "../../../utils/helpers/data_structures.ts";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";
import PiDropdownButton, {PiDropdownButtonContext} from "../../../buttons/modal-buttons/PiDropdownButton.tsx";
import PiPlainText from "../../../text/PiPlainText.tsx";
import {PiButtonVariant} from "../../../buttons/types.ts";

export type PiTextInputProps<FormObject> =
    InputSpecifications<string | number | undefined, FormObject>
    & Omit<InputProps, "isRequired" | "type" | "value" | "onChange">
    & {
    /**
     * there are instances where the text needs to be modified before being set as the text,
     * say adding a prefix or suffix to the text or a dash after every 4 characters, this is for that
     * ! for safety purposes, only works if the input type is text
     * @param text
     */
    textModifier?: (text: string) => string
    to_uppercase?: boolean
    /**
     * the type of the input, can be text, number, email or password
     */
    type?: 'text' | 'number' | 'email' | 'password'
    max_value?: number
    options?: TextOption[]
}

interface OptionPaneProps {
    option: TextOption
    onSelect: () => void
}

function OptionPane({option, onSelect}: OptionPaneProps) {
    return (
        <HStack onClick={onSelect} cursor={'pointer'} _hover={{bg: '#eee'}} w={'100%'} p={'0.5rem'}
                borderRadius={'0.5rem'}>
            <PiPlainText value={option.display}/>
        </HStack>
    )
}

interface OptionsDropdownListProps {
    options: TextOption[]
    setInputValue: (value: string | number | undefined) => void
}

function OptionsDropdownList({options, setInputValue}: OptionsDropdownListProps) {
    const {dropdown_controls: {closeDropdown}} = React.useContext(PiDropdownButtonContext)
    return (
        <VStack w={'100%'}>
            {options.map((option) => {
                return (
                    <OptionPane
                        option={option}
                        key={option.value}
                        onSelect={() => {
                            setInputValue(option.value);
                            closeDropdown()
                        }}/>
                )
            })}
        </VStack>
    )
}

export default function PiTextInput<FormObject extends Object = any>
({
     input_type = 'form', type = 'text',
     name, label, is_required, onInputChange,
     in_input_container, input_variant = InputVariant.ROUNDED, initial_value,
     textModifier, options, to_uppercase = false, max_value, ...props
 }: PiTextInputProps<FormObject>) {

    const {
        form_value, error, onBlur,
        onChange, ref
    } = useFormControllerConditionally({input_type, name})


    const local_ref = React.useRef<HTMLInputElement | null>(null);

    const [curr_value, setCurrValue] = React.useState<string | number>(form_value ?? initial_value ?? '')
    const [cursor_position, setCursorPosition] = React.useState<number | null>(null)

    const variant_styling_props = React.useMemo(() => {
        return inputVariantToTextInputStyling(input_variant)
    }, [input_variant]);

    const input_value = React.useMemo(() => {
        if (input_type === 'form') {
            return form_value ?? ''
        } else {
            return curr_value
        }
    }, [input_type, form_value, curr_value]);

    const setInputValue = React.useCallback((value: string | number | undefined) => {
        if (type === 'number' && value === '') {
            value = undefined
        }
        if (onInputChange) {
            onInputChange(value)
        }
        if (input_type === 'form') {
            if (onChange) onChange(value)
        } else {
            setCurrValue(value ?? '')
        }
    }, [input_type, onChange, setCurrValue, onInputChange, type]);


    // update the position of the cursor
    React.useEffect(() => {
        if (cursor_position !== null && local_ref.current) {
            local_ref.current?.setSelectionRange(cursor_position, cursor_position)
        }
    }, [cursor_position, curr_value]);


    return (
        <ConditionalInputContainer in_input_container={in_input_container} input_type={input_type} name={name}
                                   isRequired={is_required} label={label}
                                   error={error?.message}>
            <InputGroup>
                <Input
                    ref={mergeRefs([ref, local_ref])}
                    bg={"white"}
                    m={0}
                    border={"1px"}
                    fontSize={"sm"}
                    type={type}
                    list={options ? `${name}_options` : undefined}
                    onChange={(e) => {
                        let text_value = e.target.value;
                        let return_value: string | number = '';
                        // different input types are expected to have different types of values
                        switch (type) {
                            // text,email and password inputs are expected to have string values
                            // ? email inputs are expected to have lowercase values
                            case "email":
                                return_value = text_value.toLowerCase();
                                break;
                            // ? password inputs are left unmodified
                            case "password":
                                return_value = text_value;
                                break;
                            // ? number inputs are expected to have number values, if there is no text or the text is NaN then the text should be set to undefined
                            case "number":
                                if (text_value === "" || isNaN(Number(text_value))) {
                                    return_value = ''
                                } else {
                                    // if there is a max text, the text should be capped at the max text
                                    return_value = Math.min(Number(text_value), max_value ?? Infinity);
                                }
                                break;
                            // ? text and any other type is subject to the casing parameter and modified by the textModifier if it exists
                            case "text":
                            default:
                                const modified_text_value = textModifier ? textModifier(text_value) : text_value;
                                return_value = to_uppercase ? modified_text_value.toUpperCase() : modified_text_value;
                                // onChange(to_uppercase ? modified_text_value.toUpperCase() : modified_text_value);
                                break;
                        }

                        // setCurrValue(return_value)
                        setInputValue(return_value)
                        setCursorPosition(e.target.selectionStart)
                    }}
                    onBlur={onBlur}
                    // text={input_type === 'form' ? form_value : curr_value}
                    value={input_value}
                    {...variant_styling_props}
                    {...props}/>
                {options?.length && (
                    <InputRightElement w={'40px'}>
                        <PiDropdownButton
                            variant={PiButtonVariant.GHOST}
                            icon={BiChevronDown}
                            dropdown_anchor={'right'}
                            dropdown_container_props={{
                                width: local_ref.current?.getBoundingClientRect().width
                            }}
                            dropdown_content={
                                <OptionsDropdownList
                                    options={options}
                                    setInputValue={setInputValue}
                                />
                            }
                        />
                    </InputRightElement>
                )}
            </InputGroup>
        </ConditionalInputContainer>
    );
}