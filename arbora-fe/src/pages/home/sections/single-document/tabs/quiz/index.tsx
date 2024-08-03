import {VStack} from "@chakra-ui/react";
import React from "react";
import {isMultipleChoiceQuestion, MultipleChoiceQuestion, OpenEndedQuestion} from "./types.ts";
import QuizSetupLayer from "./setup";
import {MultipleChoiceQuizSessionLayer, OpenEndedQuizSessionLayer} from "./session";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";

enum QuizTabLayerKey {
    SESSION = 'session',
    SETUP = 'setup'
}

export default function DocumentViewQuizTab() {
    // const {
    //     documents: {active_document},
    //     document_view: {
    //         tab_data: {editor_data: {content}}
    //     }
    // } = useGlobalHomeState()

    const [active_layer, setActiveLayer] = React.useState<QuizTabLayerKey>(QuizTabLayerKey.SETUP)
    const [questions, setQuestions] = React.useState<OpenEndedQuestion[] | MultipleChoiceQuestion[]>([])

    return (
        <VStack bg={'lavender'} w={'100%'} h={'100%'} px={'1rem'}>
            <ActiveDocumentNoteSelector w={'100%'} py={'1rem'} is_disabled={active_layer === QuizTabLayerKey.SESSION}/>
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
        </VStack>
    )
}
