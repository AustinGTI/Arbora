import {InputSpecifications} from "../types";
import {Switch, SwitchProps} from "@chakra-ui/react";
import useFormControllerConditionally from "../../hooks/useFormControls";
import React from "react";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";

export type PiToggleInputProps = InputSpecifications<boolean> & SwitchProps


/**
 * an input component identical to the PiCheckboxInput component, except for the fact that it uses a switch instead of a checkbox
 * @constructor
 */
export default function PiToggleInput
({
     name, input_type, onInputChange, initial_value,
     label, is_required, ...props
 }: PiToggleInputProps) {
    const {
        form_value,
        ref, error,
        onChange, onBlur
    } = useFormControllerConditionally({name, input_type})

    const switch_toggled = React.useRef<boolean>(false);
    const [curr_value, setCurrValue] = React.useState<boolean>(form_value ?? initial_value ?? false)

    // if the curr_value changes, change the form value
    React.useEffect(() => {
        // the curr_value is not updated until the switch is first toggled
        if (!switch_toggled.current) {
            return
        }
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
            <Switch
                ref={ref}
                colorScheme={'green'}
                onBlur={onBlur}
                onChange={(e) => {
                    if (!switch_toggled.current) {
                        switch_toggled.current = true;
                    }
                    // the value is converted to a boolean for the form
                    setCurrValue(e.target.checked);
                }}
                isChecked={curr_value}
                mx={'1rem'}
                {...props}/>
        </ConditionalInputContainer>

    );
}
