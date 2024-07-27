export interface InputDimensionSpecifications {
    width?: string,
    w?: string,
    height?: string,
    h?: string,
}

export interface GenericInputProps<FormObject = any> {
    name: keyof FormObject;
    label?: string;
    description?: string;
    is_required?: boolean;
}

export type InputType = 'generic' | 'form'

export enum InputVariant {
    CLASSIC = 'classic',
    ROUNDED = 'rounded',
}

type NonArrayObject<T, Fallback> = T extends any[] ? Fallback : T extends object ? T | null : T;

/**
 * these are the props required when the input_type is 'form'
 */
type FormInputSpecifications<FormObject> = {
    /**
     * the type of the input, this is used to determine how the data is returned either through the form or
     * directly using onSelectedChoicesChange, this is the default text
     */
    input_type?: 'form'
    initial_value?: never
    /**
     * whether or not the input component is rendered inside an input container
     * by default is true
     */
    in_input_container?: boolean
} & GenericInputProps<FormObject>
/**
 * these are the props required when the input_type is 'generic'
 */
type GenericInputSpecifications<InitialInput> = {
    /**
     * the type of the input, this is used to determine how the data is returned either through the form or
     * directly using onSelectedChoicesChange
     */
    input_type: 'generic'

    in_input_container?: never
    /**
     * the text displayed in the input when the component loads for the first time,
     * in form inputs, the form controls the initial text thus this parameter is only
     * available if the input_type is 'generic'
     */
    initial_value?: InitialInput
} & { [key in keyof GenericInputProps]?: never }

export type InputSpecifications<InputType = any, FormObject = any> =
    (FormInputSpecifications<FormObject> | GenericInputSpecifications<InputType>)
    & {
    /**
     * a function that is called when the input text changes, the new text is passed as an argument
     * @param text
     */
    onInputChange?: (value: NonArrayObject<InputType, InputType>) => void
    /**
     * the variant of the input, this is used to determine the style of the input
     * variants are batches of styles that are used to style the input
     */
    input_variant?: InputVariant
}