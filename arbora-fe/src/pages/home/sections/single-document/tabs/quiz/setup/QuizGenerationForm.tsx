import * as yup from 'yup'
import {SimpleFormProps} from "../../../../../../../core/forms/types.ts";
import PiFormFields from "../../../../../../../pillars-ui/components/forms/PiFormFields.tsx";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiForm from "../../../../../../../pillars-ui/components/forms/PiForm.tsx";
import {HStack, VStack} from "@chakra-ui/react";
import PiFormSubmitButton
    from "../../../../../../../pillars-ui/components/forms/helper_components/PiFormSubmitButton.tsx";
import {QuizType} from "../types.ts";

export interface QuizGenFormObject {
    no_of_questions: number
    quiz_type: QuizType
}


const form_schema: yup.ObjectSchema<QuizGenFormObject> = yup.object()
    .shape({
        no_of_questions: yup.number().required('Kindly enter the number of questions to generate'),
        quiz_type: yup.string().oneOf(Object.values(QuizType)).required('Kindly select a quiz type')
    })

interface QuizGenFormProps extends SimpleFormProps<QuizGenFormObject> {
}

function QuizGenFormFields() {
    return (
        <PiFormFields flex={undefined} h={'fit-content'} py={0} my={0}>
            <PiTextInput<QuizGenFormObject>
                name={'no_of_questions'} type={'number'} label={'No. of Questions'} placeholder={'Number of Flash Cards'}
                is_required input_container_props={{label_alignment: 'center'}}/>
        </PiFormFields>
    )
}


export default function QuizGenerationForm
({
     initial_values,
     submitFunction
 }: QuizGenFormProps) {
    return (
        <PiForm<QuizGenFormObject>
            initial_data={initial_values}
            submitFunction={submitFunction} yup_schema={form_schema}>
            <VStack justify={'center'} w={'100%'} flex={1}>
                <QuizGenFormFields/>
                <HStack w={'100%'} justify={'center'} mt={'1rem'}>
                    <PiFormSubmitButton label={'Generate Quiz'}/>
                </HStack>
            </VStack>
        </PiForm>
    )
}
