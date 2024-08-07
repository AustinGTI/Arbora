import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import {QuizType} from "../types.ts";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiInputLabel from "../../../../../../../pillars-ui/components/forms/inputs/helper-components/PiInputLabel.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiMultiButton from "../../../../../../../pillars-ui/components/buttons/modal-buttons/PiMultiButton.tsx";
import {ButtonOnClickFunction, PiButtonVariant} from "../../../../../../../pillars-ui/components/buttons/types.ts";
import {MultipleChoiceQuestion, OpenEndedQuestion} from "../../../../../../../core/services/ai/types.ts";
import {
    getMultipleChoiceQuestionsService,
    getOpenEndedQuestionsService
} from "../../../../../../../core/services/ai/AIServices.ts";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import useActiveContent from "../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import TreeAnimationLoader from "../../../../../../../core/graphics/loaders/TreeAnimationLoader.tsx";

interface QuizSetupLayerProps extends BoxProps {
    takeQuiz: (cards: MultipleChoiceQuestion[] | OpenEndedQuestion[]) => void

}


export default function QuizSetupLayer({takeQuiz, ...box_props}: QuizSetupLayerProps) {
    const [no_of_questions, setNoOfCards] = React.useState<number>(25)

    const [generating_quiz, setGeneratingQuiz] = React.useState<boolean>(false)

    const [quiz_type, setQuizType] = React.useState<QuizType>(QuizType.OPEN_ENDED)

    const quiz_content = useActiveContent()
    const handleOnClickTakeQuiz: ButtonOnClickFunction = React.useCallback(async () => {
        setGeneratingQuiz(true)

        if (!quiz_content) {
            StandardConsole.warn('No active document to review')
            return
        }

        if (quiz_type === QuizType.MULTIPLE_CHOICE) {
            await getMultipleChoiceQuestionsService({
                no_of_questions,
                content: quiz_content
            }).then(response => {
                if (response.is_successful) {
                    takeQuiz(response.data!.questions)
                }
            })
        } else {
            await getOpenEndedQuestionsService({
                no_of_questions,
                content: quiz_content
            }).then(response => {
                if (response.is_successful) {
                    takeQuiz(response.data!.questions)
                }
            })
        }
        setGeneratingQuiz(false)

    }, [no_of_questions, quiz_type, takeQuiz, quiz_content, setGeneratingQuiz]);

    return (
        <Center w={'100%'} h={'100%'} {...box_props}>
            {generating_quiz ? (
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
                            initial_value={no_of_questions}
                            onInputChange={(n) => {
                                if (n && !isNaN(n as number)) {
                                    setNoOfCards(n as number)
                                }
                            }}/>
                    </VStack>

                    <Center w={'100%'} py={'1rem'}>
                        <PiButton
                            label={'Take Quiz'}
                            isDisabled={no_of_questions <= 0}
                            onClick={handleOnClickTakeQuiz}/>
                    </Center>
                </VStack>
            ) : (
                <TreeAnimationLoader
                    text={`Generating ${quiz_type === QuizType.MULTIPLE_CHOICE ? 'Multiple Choice' : 'Open Ended'} Quiz`}
                    pb={'5rem'}/>
            )}
        </Center>
    )
}
