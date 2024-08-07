import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import {QuizType} from "../types.ts";
import {MultipleChoiceQuestion, OpenEndedQuestion} from "../../../../../../../core/services/ai/types.ts";
import {
    getMultipleChoiceQuestionsService,
    getOpenEndedQuestionsService
} from "../../../../../../../core/services/ai/AIServices.ts";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import useActiveContent from "../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import TreeAnimationLoaderV2 from "../../../../../../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";
import QuizGenerationForm, {QuizGenFormObject} from "./QuizGenerationForm.tsx";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";

interface QuizSetupLayerProps extends BoxProps {
    takeQuiz: (cards: MultipleChoiceQuestion[] | OpenEndedQuestion[]) => void

}


export default function QuizSetupLayer({takeQuiz, ...box_props}: QuizSetupLayerProps) {
    const [generating_quiz, setGeneratingQuiz] = React.useState<boolean>(false)

    const [quiz_type, setQuizType] = React.useState<QuizType>(QuizType.MULTIPLE_CHOICE)

    const quiz_content = useActiveContent()
    const handleOnClickTakeQuiz = React.useCallback(async ({quiz_type, no_of_questions}: QuizGenFormObject) => {
        setGeneratingQuiz(true)
        setQuizType(quiz_type)

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

    }, [takeQuiz, quiz_content, setGeneratingQuiz, setQuizType]);

    return (
        <Center w={'100%'} h={'calc(100% - 40px)'} mb={'1rem'} mt={'0.5rem'} {...box_props}>
            {!generating_quiz ? (
                <VStack w={'40%'} h={'100%'} justify={'center'} rounded={'10px'} bg={ARBORA_GREEN.bg} p={'1rem'}>
                    <QuizGenerationForm submitFunction={handleOnClickTakeQuiz}/>
                </VStack>
            ) : (
                <TreeAnimationLoaderV2
                    text={`Generating ${quiz_type === QuizType.MULTIPLE_CHOICE ? 'Multiple Choice' : 'Open Ended'} Quiz`}
                    pb={'5rem'}/>
            )}
        </Center>
    )
}
