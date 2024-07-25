import {UseFormSetError} from "react-hook-form";

export type FormSubmitFunction<FormObject extends Object> = (data: FormObject, setError: UseFormSetError<FormObject>) => Promise<void>

export interface SimpleFormProps<FormObject extends Object> {
    initial_values?: FormObject
    submitFunction: FormSubmitFunction<FormObject>
}