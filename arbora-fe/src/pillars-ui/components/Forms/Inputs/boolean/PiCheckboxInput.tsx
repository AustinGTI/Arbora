import React from "react";
import {Checkbox, CheckboxProps} from "@chakra-ui/react";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";
import {InputSpecifications} from "../types";
import useFormControllerConditionally from "../../hooks/useFormControls";

export type PiCheckboxInputProps = InputSpecifications<boolean> & CheckboxProps

/**
 * A checkbox input component, as a form, it sets the key 'name' to the boolean value of the checkbox,
 * as a generic input, it calls the function onInputChange with the boolean value of the checkbox, this function is also
 * available for form inputs
 * @constructor
 */
export default function PiCheckboxInput
({
     name, input_type, onInputChange, initial_value,
     label, is_required, ...props
 }: PiCheckboxInputProps) {
    const {
        form_value,
        ref, error,
        onChange, onBlur
    } = useFormControllerConditionally({name, input_type})

    const [curr_value, setCurrValue] = React.useState<boolean>(form_value ?? initial_value ?? false)

    // if the curr_value changes, change the form value
    React.useEffect(() => {
        if (onChange) {
            onChange(curr_value)
        }
        if (onInputChange) {
            onInputChange(curr_value)
        }
    }, [curr_value]);

    return (
        <ConditionalInputContainer input_type={input_type} name={name} isRequired={is_required} label={label}
                                   label_position={'right'} error={error?.message}>
            <Checkbox
                ref={ref}
                onBlur={onBlur}
                onChange={(e) => {
                    // the value is converted to a boolean for the form
                    setCurrValue(e.target.checked);
                }}
                isChecked={curr_value}
                mx={'1rem'}
                {...props}/>
        </ConditionalInputContainer>

    );
}