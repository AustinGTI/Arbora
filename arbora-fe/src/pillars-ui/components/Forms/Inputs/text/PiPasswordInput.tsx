import {InputSpecifications, InputVariant} from "../types";
import {Icon, Input, InputGroup, InputProps, InputRightElement} from "@chakra-ui/react";
import React from "react";
import useFormControllerConditionally from "../../hooks/useFormControls";
import {inputVariantToTextInputStyling} from "./helpers";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";
import {IoIosEye, IoIosEyeOff} from "react-icons/io";

export type PiPasswordTextInputProps<FormObject> =
    InputSpecifications<string | number | undefined, FormObject>
    & Omit<InputProps, "isRequired" | "type" | "value" | "onChange">


export default function PiPasswordInput<FormObject extends Object = any>
({
     input_type = 'form', input_variant = InputVariant.ROUNDED,
     name, label, is_required, onInputChange,
     in_input_container, ...props
 }: PiPasswordTextInputProps<FormObject>) {

    const {
        form_value, error, onBlur,
        onChange, ref
    } = useFormControllerConditionally({input_type, name})

    const [curr_value, setCurrValue] = React.useState<string | number>(form_value ?? '')
    const [password_shown, setPasswordShown] = React.useState<boolean>(false)

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
        if (onInputChange) {
            onInputChange(value)
        }
        if (input_type === 'form') {
            if (onChange) onChange(value)
        } else {
            setCurrValue(value ?? '')
        }
    }, [input_type, onChange, setCurrValue, onInputChange]);

    return (

        <ConditionalInputContainer in_input_container={in_input_container} input_type={input_type} name={name}
                                   isRequired={is_required} label={label}
                                   error={error?.message}>
            <InputGroup>
                <Input
                    ref={ref}
                    bg={"white"}
                    m={0}
                    border={"1px"}
                    fontSize={"sm"}
                    type={password_shown ? 'text' : 'password'}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    onBlur={onBlur}
                    value={input_value}
                    {...variant_styling_props}
                    {...props}/>
                <InputRightElement
                    width={'40px'}
                    borderRadius={4}
                    cursor="pointer"
                    onClick={() => {
                        setPasswordShown(!password_shown)
                    }}>
                    <Icon
                        color={variant_styling_props?.borderColor ?? "gray.700"}
                        boxSize={6}
                        as={password_shown ? IoIosEye : IoIosEyeOff}
                    />
                </InputRightElement>
            </InputGroup>
        </ConditionalInputContainer>
    )
}
