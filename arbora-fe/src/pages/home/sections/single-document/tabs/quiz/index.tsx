import {VStack} from "@chakra-ui/react";
import React from "react";
import QuizSetupLayer from "./setup";
import {OpenEndedQuizSessionLayer} from "./session/open-ended";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";
import {
    isMultipleChoiceQuestion,
    MultipleChoiceQuestion,
    OpenEndedQuestion
} from "../../../../../../core/services/ai/types.ts";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import MultipleChoiceQuizSessionLayer from "./session/multiple-choice";

enum QuizTabLayerKey {
    SESSION = 'session',
    SETUP = 'setup'
}

export default function DocumentViewQuizTab() {
    const {
        documents: {active_document},
    } = useGlobalHomeState()

    const [active_layer, setActiveLayer] = React.useState<QuizTabLayerKey>(QuizTabLayerKey.SETUP)
    const [questions, setQuestions] = React.useState<OpenEndedQuestion[] | MultipleChoiceQuestion[]>([])

    return (
        <VStack bg={'lavender'} w={'100%'} h={'100%'} px={'1rem'}>
            {active_document ? (
                <React.Fragment>
                    <ActiveDocumentNoteSelector w={'100%'} py={'1rem'}
                                                is_disabled={active_layer === QuizTabLayerKey.SESSION}/>
                    {active_layer === QuizTabLayerKey.SETUP && (
                        <QuizSetupLayer
                            w={'100%'} h={'100%'}
                            takeQuiz={(questions) => {
                                setQuestions(questions)
                                setActiveLayer(QuizTabLayerKey.SESSION);
                            }}/>
                    )}
                    {active_layer === QuizTabLayerKey.SESSION && (
                        isMultipleChoiceQuestion(questions[0]) ? (
                            <MultipleChoiceQuizSessionLayer
                                w={'100%'} h={'100%'}
                                questions={questions as MultipleChoiceQuestion[]}
                                completeSession={(quiz_session_records) => {
                                    setActiveLayer(QuizTabLayerKey.SETUP);
                                    StandardConsole.log('Session Complete', quiz_session_records)
                                }}/>
                        ) : (
                            <OpenEndedQuizSessionLayer
                                w={'100%'} h={'100%'}
                                questions={questions as OpenEndedQuestion[]}
                                completeSession={(quiz_session_records) => {
                                    setActiveLayer(QuizTabLayerKey.SETUP);
                                    StandardConsole.log('Session Complete', quiz_session_records)
                                }}/>
                        ))}
                </React.Fragment>
            ) : (
                <PiPlainText value={'Select a document to perform a quiz'}/>
            )}
        </VStack>
    )
}
