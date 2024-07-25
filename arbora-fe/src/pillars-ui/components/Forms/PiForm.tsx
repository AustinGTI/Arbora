import React from "react";
import {DefaultValues, FieldValues, FormProvider, Resolver, useForm, UseFormSetError} from "react-hook-form";
import {chakra, VStack} from "@chakra-ui/react";
import {yupResolver} from "@hookform/resolvers/yup";
import {ObjectSchema} from "yup";
import {StandardConsole} from "../../../core/helpers/logging.ts";

export type BaseFormSubmitFunction<Data extends FieldValues> = (data: Data, setError: UseFormSetError<Data>) => Promise<void>

export type PiFormProps<Data extends FieldValues> = {
    initial_data?: DefaultValues<Data>
    submitFunction: BaseFormSubmitFunction<Data>
    children: React.ReactNode
    yup_schema: ObjectSchema<Data>
}

interface ExtraFormContextProps {
    form_button_loading: boolean
}

/**
 * The original form context makes it impossible to access the form button loading state
 * This context provides said value to the submit button
 */
export const ExtraFormContext = React.createContext<ExtraFormContextProps>({
    form_button_loading: false
})

/**
 * A wrapper around the react-hook-form useForm hook that provides a form context to the children as well as provides the
 * appropriate context for the corresponding pillars-ui components
 * @param initial_data
 * @param submitFunction
 * @param yup_schema
 * @param children
 * @constructor
 */
export default function PiForm<Data extends FieldValues>
({
     initial_data, submitFunction, yup_schema, children
 }: PiFormProps<Data>) {
    const methods = useForm<Data>({
        defaultValues: initial_data,
        resolver: yupResolver(yup_schema) as unknown as Resolver<Data>,
    });

    const [form_button_loading, setFormButtonLoading] = React.useState<boolean>(false)

    // if the initial data changes, update the form values
    React.useEffect(() => {
        if (initial_data) {
            methods.reset(initial_data);
        }
    }, [initial_data]);


    const onSubmit = React.useCallback(async (data: Data) => {
        // on submit first clear the existing errors
        methods.clearErrors()
        setFormButtonLoading(true)
        await submitFunction(data, methods.setError);
        setFormButtonLoading(false)

    }, [submitFunction, setFormButtonLoading, methods]);

    const nativeOnSubmitFunction = React.useCallback((e: React.FormEvent) => {
        // we want to stop any propagation to any potential parent forms
        e.stopPropagation()
        // then we call the actual submit function
        methods.handleSubmit(onSubmit)(e)
    }, [methods, onSubmit]);

    const form_values = methods.watch()

    React.useEffect(() => {
        // print out the form values when the form values change
        StandardConsole.log('%c[FormValues] The values in the current form are ', 'background: black; color: #FFC1CC', form_values)
    }, [form_values]);

    React.useEffect(() => {
        // print out the form errors when the form errors change if there are form errors
        if (Object.keys(methods.formState.errors).length > 0) {
            StandardConsole.log('%c[FormErrors] The errors in the current form are ', 'background: black; color: #EC3B83', methods.formState.errors)
        }
    }, [methods.formState]);

    return (
        <FormProvider {...methods}>
            <ExtraFormContext.Provider value={{form_button_loading}}>
                <chakra.form onSubmit={nativeOnSubmitFunction} h={'100%'} width={"100%"}>
                    <VStack w={'100%'} h={'100%'} justify={'space-between'}>
                        {children}
                    </VStack>
                </chakra.form>
            </ExtraFormContext.Provider>
        </FormProvider>
    );
}