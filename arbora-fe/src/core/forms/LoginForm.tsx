import * as yup from 'yup'
import {SimpleFormProps} from "./types.ts";
import PiForm from "../../pillars-ui/components/forms/PiForm.tsx";
import PiFormSubmitButton from "../../pillars-ui/components/forms/helper_components/PiFormSubmitButton.tsx";
import PiFormFields from "../../pillars-ui/components/forms/PiFormFields.tsx";
import PiTextInput from "../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiPasswordInput from "../../pillars-ui/components/forms/inputs/text/PiPasswordInput.tsx";
import PiButton from "../../pillars-ui/components/buttons/PiButton.tsx";
import {HStack} from "@chakra-ui/react";
import {PiButtonVariant} from "../../pillars-ui/components/buttons/types.ts";
import React from "react";
import {PiLayerContainerContext} from "../../pillars-ui/components/containers/dynamic-containers/PiLayerContainer.tsx";
import {LoginPageLayerKey} from "../../pages/login";


// the single_doc_section type that the form will actually manipulate
interface LoginFormObject {
    email: string
    password: string
}

// a schema to specify more complex frontend validation
const form_schema: yup.ObjectSchema<LoginFormObject> = yup.object()
    .shape({
        email: yup.string().email().required('Kindly enter your email to login'),
        password: yup.string().required('Kindly enter your password to login')
    })


interface LoginFormProps extends SimpleFormProps<LoginFormObject> {
}

interface LoginFormFieldsProps {
}

// the form fields
function LoginFormFields({}: LoginFormFieldsProps) {

    return (
        <PiFormFields py={0} my={0}>
            <PiTextInput<LoginFormObject>
                name={'email'} type={'email'} label={'Email'} placeholder={'Enter your email'} is_required/>
            <PiPasswordInput<LoginFormObject>
                name={'password'} label={'Password'} placeholder={'Enter your password'} is_required/>
        </PiFormFields>
    )
}


export default function LoginForm
({
     initial_values,
     submitFunction,
 }: LoginFormProps) {
    const {navigation_props: {goToLayer}} = React.useContext(PiLayerContainerContext)

    return (
        <PiForm<LoginFormObject>
            initial_data={initial_values}
            submitFunction={submitFunction} yup_schema={form_schema}>
            <LoginFormFields/>
            <HStack w={'100%'} justify={'space-between'} mt={'1rem'}>
                <PiButton
                    label={'Sign Up'}
                    variant={PiButtonVariant.OUTLINE}
                    onClick={() => {
                        goToLayer(LoginPageLayerKey.SIGNUP_FORM)
                    }}
                />
                <PiFormSubmitButton label={'Login to Arbora'}/>
            </HStack>
        </PiForm>
    )
}
