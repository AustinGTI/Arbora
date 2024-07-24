import {useController, useWatch} from "react-hook-form";
import {InputType} from "../Inputs/types";
import {StandardConsole} from "../../../../core/helpers/logging.ts";

interface UseFormControlsProps {
    name: string
}

type UseFormControllerConditionallyProps =
    { input_type?: InputType, name?: string }


function useFormControls({name}: UseFormControlsProps) {

    const {
        field: {ref, onChange, onBlur},
        fieldState: {error}
    } = useController({name});

    const form_value = useWatch({name})

    return {ref, onChange, onBlur, form_value, error}
}

/**
 * in order for the input components to be able to function as both form inputs and generic inputs,
 * this hook is used to conditionally return the form controls if the input type is form,
 * a try catch is used to prevent errors from being thrown when the input type is generic and the form controls are not available
 * @param input_type
 * @param name
 */
export default function useFormControllerConditionally({input_type, name}: UseFormControllerConditionallyProps) {
    // if input type is form or undefined there must be a name
    if ((input_type !== 'generic') && !name) {
        throw new Error('Form input must have a name')
    }

    if (input_type !== 'generic') {
        try {
            return useFormControls({name: name!})
        } catch (e) {
            StandardConsole.error(e)
            return {ref: undefined, onChange: undefined, onBlur: undefined, form_value: undefined, error: undefined}
        }
    } else {
        return {ref: undefined, onChange: undefined, onBlur: undefined, form_value: undefined, error: undefined}
    }
}
