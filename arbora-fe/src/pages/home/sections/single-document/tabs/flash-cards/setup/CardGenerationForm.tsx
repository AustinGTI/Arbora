import * as yup from 'yup'
import {SimpleFormProps} from "../../../../../../../core/forms/types.ts";
import PiFormFields from "../../../../../../../pillars-ui/components/forms/PiFormFields.tsx";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiForm from "../../../../../../../pillars-ui/components/forms/PiForm.tsx";
import {HStack, VStack} from "@chakra-ui/react";
import PiFormSubmitButton
    from "../../../../../../../pillars-ui/components/forms/helper_components/PiFormSubmitButton.tsx";

export interface CardGenFormObject {
    no_of_cards: number
}


const form_schema: yup.ObjectSchema<CardGenFormObject> = yup.object()
    .shape({
        no_of_cards: yup.number().required('Kindly enter the number of cards to generate').max(25, 'Max 25 cards')
    })

interface CardGenFormProps extends SimpleFormProps<CardGenFormObject> {
    submit_disabled?: boolean
}

function CardGenFormFields() {
    return (
        <PiFormFields flex={1} h={'fit-content'} my={0}>
            <VStack h={'100%'}>
                <PiTextInput<CardGenFormObject>
                    name={'no_of_cards'} type={'number'} label={'No. of Cards'} placeholder={'Number of Flash Cards'}
                    is_required input_container_props={{label_alignment: 'center'}}/>
            </VStack>
        </PiFormFields>
    )
}


export default function CardGenerationForm
({
     initial_values,
     submit_disabled,
     submitFunction
 }: CardGenFormProps) {
    return (
        <PiForm<CardGenFormObject>
            initial_data={initial_values}
            submitFunction={submitFunction} yup_schema={form_schema}>
            <VStack justify={'center'} w={'100%'} flex={1}>
                <CardGenFormFields/>
                <HStack w={'100%'} justify={'center'} mt={'1rem'}>
                    <PiFormSubmitButton
                        with_tooltip={submit_disabled}
                        tooltip_label={'There must be content to generate flash cards from'}
                        label={'Generate Flash Cards'} isDisabled={submit_disabled}/>
                </HStack>
            </VStack>
        </PiForm>
    )
}
