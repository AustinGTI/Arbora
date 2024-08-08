import React from "react";
import {InputSpecifications} from "../types.ts";
import useFormControllerConditionally from "../../hooks/useFormControls.tsx";
import {Select} from "@chakra-ui/react";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";

interface ObjectChoiceProps<ChoiceType extends Object, ReturnType extends Object | string | number> {
    choices: ChoiceType[]
    getReturnValue?: (choice: ChoiceType) => ReturnType
    getKeyValue: (choice: ChoiceType) => string
    getDisplayValue: (choice: ChoiceType) => string
}

interface StringChoiceProps<ReturnType extends Object | string | number> {
    choices: string[]
    getReturnValue: (choice: string) => ReturnType
    getKeyValue?: (choice: string) => string
    getDisplayValue?: (choice: string) => string
}

export type PiDropdownSelectInputProps<ReturnType extends Object | string | number, ChoiceType extends Object> =
    InputSpecifications<Object | string | number>
    & {
    placeholder?: string
} & (ObjectChoiceProps<ChoiceType, ReturnType> | StringChoiceProps<ReturnType>)

interface StringChoice {
    key: string
    value: string
    display: string
}

export default function PiDropdownSelectInput<ReturnType extends Object | string | number, ChoiceType extends Object = StringChoice>
({
     input_type = 'form', choices,
     getKeyValue, getReturnValue, getDisplayValue, placeholder,
     name, label, is_required, onInputChange, input_container_props,
     initial_value, in_input_container, input_variant, ...props
 }: PiDropdownSelectInputProps) {
    // region CHOICES CONFIGURATION
    // ? ........................

    // if there are no choices, throw an error
    if (!choices.length) {
        throw new Error('Choices must be set')
    }

    // if the choices are not strings and the get key and display functions are not set, throw an error
    if (typeof choices[0] === 'object' && !(getKeyValue && getReturnValue && getDisplayValue)) {
        throw new Error('getKeyValue and getDisplayValue must be set when choices are not strings')
    }

    // convert string choices to StringChoice objects
    if (typeof choices[0] === 'string') {
        choices = (choices as string[]).map((choice) => ({
            key: getKeyValue ? getKeyValue(choice) : choice,
            value: getReturnValue ? getReturnValue(choice) : choice,
            display: getDisplayValue ? getDisplayValue(choice) : choice
        } as StringChoice))

        getKeyValue = (choice: StringChoice) => choice.key
        getReturnValue = (choice: StringChoice) => choice.value
        getDisplayValue = (choice: StringChoice) => choice.display
    }

    getReturnValue = getReturnValue ?? ((choice: ChoiceType) => choice as unknown as ReturnType)

    // ? ........................
    // endregion ........................


    const {
        form_value, error, onBlur,
        onChange, ref
    } = useFormControllerConditionally({input_type, name})

    // curr value is used for input_control in the case of a generic input
    const [curr_value, setCurrValue] = React.useState<ChoiceType>(form_value ?? initial_value)

    /**
     rawInputValue refers to the data that is directly output by the input component e.g text in the case of a text input

     inputValue refers to the processed form of rawInputValue that this component returns
     for instance a number parsed from a string if the text input is of type numeric
     **/

    const rawInputValueToInputValue = React.useCallback((raw_input: string | undefined): ReturnType | undefined => {
        if (!raw_input) return undefined
        return getReturnValue(choices.find((choice) => getKeyValue(choice) === raw_input))
    }, [getReturnValue, choices, getKeyValue])

    const inputValueToRawInputValue = React.useCallback((input_value: ReturnType | undefined): string | undefined => {
        if (!input_value) return undefined
        const selected_choice = choices.find((choice) => JSON.stringify(getReturnValue(choice)) === JSON.stringify(input_value))
        if (!selected_choice) return undefined
        return getKeyValue(selected_choice)
    }, [choices, getReturnValue, getKeyValue])

    /**
     raw_input and setRawInputValue are the value and function that directly interact with the input
     component, raw_input is set to its value prop or its equivalent and setRawInputValue is set to
     its onChange prop or similar
     **/
    const raw_input = React.useMemo(() => {
        if (input_type === 'form') {
            return inputValueToRawInputValue(form_value)
        } else {
            return inputValueToRawInputValue(curr_value)
        }
    }, [input_type, form_value, curr_value, inputValueToRawInputValue]);

    const setRawInputValue = React.useCallback((raw_input: string) => {
        const value = rawInputValueToInputValue(raw_input)
        if (onInputChange) {
            onInputChange(value)
        }
        if (input_type === 'form') {
            onChange?.(value)
        } else {
            setCurrValue(value)
        }
    }, [input_type, onChange, onInputChange, rawInputValueToInputValue, setCurrValue]);

    return (
        <ConditionalInputContainer
            input_type={input_type} name={name}
            in_input_container={in_input_container}
            isRequired={is_required} label={label} error={error?.message} {...input_container_props}>
            <Select
                bg={'white'} fontSize={'sm'} border={'1px'} fontWeight={500}
                placeholder={placeholder}
                ref={ref} onBlur={onBlur} value={raw_input} onChange={(e) => setRawInputValue(e.target.value)}>
                {choices.map((choice, index) => (
                    <option
                        style={{
                            paddingTop: '.5rem',
                            paddingBottom: '.5rem',
                        }}
                        key={index} value={getKeyValue(choice)}>
                        {getDisplayValue(choice)}
                    </option>
                ))}
            </Select>
        </ConditionalInputContainer>
    );
}
