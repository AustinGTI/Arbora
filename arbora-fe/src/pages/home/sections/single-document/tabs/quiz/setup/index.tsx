import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import {MultipleChoiceQuestion, OpenEndedQuestion, QuizType} from "../types.ts";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiInputLabel from "../../../../../../../pillars-ui/components/forms/inputs/helper-components/PiInputLabel.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiMultiButton from "../../../../../../../pillars-ui/components/buttons/modal-buttons/PiMultiButton.tsx";
import {PiButtonVariant} from "../../../../../../../pillars-ui/components/buttons/types.ts";

interface QuizSetupLayerProps extends BoxProps {
    takeQuiz: (cards: MultipleChoiceQuestion[] | OpenEndedQuestion[]) => void

}

function generateMultipleChoiceQuestions(no_of_questions: number): MultipleChoiceQuestion[] {
    const questions: MultipleChoiceQuestion[] = []
    for (let i = 0; i < no_of_questions; i++) {
        const choices = [`Option 1`, `Option 2`, `Option 3`, `Option 4`]
        const random_index = Math.floor(Math.random() * choices.length)
        questions.push({
            id: i.toString(),
            question: `Question ${i}`,
            choices: choices,
            correct_choice: random_index
        })
    }
    return questions
}

function generateOpenEndedQuestions(no_of_questions: number): OpenEndedQuestion[] {
    const questions: OpenEndedQuestion[] = []
    for (let i = 0; i < no_of_questions; i++) {
        questions.push({
            id: i.toString(),
            question: `Question ${i}`
        })
    }
    return questions
}


export default function QuizSetupLayer({takeQuiz, ...box_props}: QuizSetupLayerProps) {
    const [no_of_cards, setNoOfCards] = React.useState<number>(25)

    const [quiz_type, setQuizType] = React.useState<QuizType>(QuizType.OPEN_ENDED)

    const handleOnClickTakeQuiz = React.useCallback(() => {
        // todo: some async call to fetch questions
        if (quiz_type === QuizType.MULTIPLE_CHOICE) {
            takeQuiz(generateMultipleChoiceQuestions(no_of_cards))
        } else {
            takeQuiz(generateOpenEndedQuestions(no_of_cards))
        }
    }, [no_of_cards, quiz_type, takeQuiz]);

    return (
        <Center w={'100%'} h={'100%'} {...box_props}>
            <VStack w={'50%'} h={'75%'} justify={'space-around'}>
                <VStack w={'100%'}>
                    <PiInputLabel m={0} name={'quiz_type'} label={'Quiz Type'}/>
                    <PiMultiButton
                        label={quiz_type === QuizType.MULTIPLE_CHOICE ? 'Multiple Choice' : 'Open Ended'}
                        w={'100%'}
                        variant={PiButtonVariant.GHOST}
                        dropdown_container_props={{
                            w: "match-button"
                        }}
                        nested_buttons_props={[
                        {
                            label: 'Multiple Choice',
                            onClick: () => setQuizType(QuizType.MULTIPLE_CHOICE),
                        },
                        {
                            label: 'Open Ended',
                            onClick: () => setQuizType(QuizType.OPEN_ENDED),
                        }
                    ]}/>
                </VStack>
                <VStack w={'100%'}>
                    <PiInputLabel m={0} name={'no_of_cards'} label={'Number of Questions'}/>
                    <PiTextInput
                        type={'number'}
                        input_type={'generic'}
                        initial_value={no_of_cards}
                        onInputChange={(n) => {
                            if (n && !isNaN(n as number)) {
                                setNoOfCards(n as number)
                            }
                        }}/>
                </VStack>

                <Center w={'100%'} py={'1rem'}>
                    <PiButton
                        label={'Take Quiz'}
                        isDisabled={no_of_cards <= 0}
                        onClick={handleOnClickTakeQuiz}/>
                </Center>
            </VStack>
        </Center>
    )
}
