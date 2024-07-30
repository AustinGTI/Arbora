import * as yup from 'yup'
import {SimpleFormProps} from "./types.ts";
import PiForm from "../../pillars-ui/components/forms/PiForm.tsx";
import PiFormSubmitButton from "../../pillars-ui/components/forms/helper_components/PiFormSubmitButton.tsx";
import PiFormFields from "../../pillars-ui/components/forms/PiFormFields.tsx";
import PiTextInput from "../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiPasswordInput from "../../pillars-ui/components/forms/inputs/text/PiPasswordInput.tsx";
import {HStack} from "@chakra-ui/react";


// the single_doc_section type that the form will actually manipulate
interface SignupFormObject {
    name: string
    email: string
    password: string
    password_confirmation: string
}

// a schema to specify more complex frontend validation
const form_schema: yup.ObjectSchema<SignupFormObject> = yup.object()
    .shape({
        name: yup.string().required('Kindly enter your name to login'),
        email: yup.string().email().required('Kindly enter your email to login'),
        password: yup.string().required('Kindly enter your password to login'),
        password_confirmation: yup.string().required('Kindly confirm your password')
            .oneOf([yup.ref('password'), ''], 'Your confirmation password does not match your password, Kindly Try again.')
    })


interface SignUpFormProps extends SimpleFormProps<SignupFormObject> {
}

interface SignUpFormFieldsProps {
}

// the form fields
function SignUpFormFields({}: SignUpFormFieldsProps) {

    return (
        <PiFormFields py={0} my={0}>
            <PiTextInput<SignupFormObject>
                name={'name'} label={'Name'} placeholder={'Enter a username'} is_required/>
            <PiTextInput<SignupFormObject>
                name={'email'} type={'email'} label={'Email'} placeholder={'Enter your email'} is_required/>
            <PiPasswordInput<SignupFormObject>
                name={'password'} label={'Password'} placeholder={'Enter a password'} is_required/>
            <PiPasswordInput<SignupFormObject>
                name={'password_confirmation'} label={'Confirm Password'} placeholder={'Confirm your password'}
                is_required/>
        </PiFormFields>
    )
}


export default function SignUpForm
({
     initial_values,
     submitFunction,
 }: SignUpFormProps) {
    return (
        <PiForm<SignupFormObject>
            initial_data={initial_values}
            submitFunction={submitFunction} yup_schema={form_schema}>
            <SignUpFormFields/>
            <HStack w={'100%'} justify={'center'} mt={'1rem'}>
                <PiFormSubmitButton label={'Sign Up To Arbora'}/>
            </HStack>
        </PiForm>
    )
}
