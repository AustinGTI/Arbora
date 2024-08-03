import {VStack} from "@chakra-ui/react";
import React from "react";
import QuizSetupLayer from "./setup";
import {OpenEndedQuizSessionLayer} from "./session/open-ended";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";
import {
    isMultipleChoiceQuestion,
    MultipleChoiceQuestion,
    OpenEndedQuestion, OpenEndedQuestionAssessment
} from "../../../../../../core/services/ai/types.ts";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import MultipleChoiceQuizSessionLayer from "./session/multiple-choice";
import {recordNoteReviewService} from "../../../../../../core/services/documents/DocumentsCRUDServices.ts";
import {NoteReviewType} from "../../../../../../core/services/documents/types.ts";

enum QuizTabLayerKey {
    SESSION = 'session',
    SETUP = 'setup'
}

export default function DocumentViewQuizTab() {
    const [active_layer, setActiveLayer] = React.useState<QuizTabLayerKey>(QuizTabLayerKey.SETUP)
    const [questions, setQuestions] = React.useState<OpenEndedQuestion[] | MultipleChoiceQuestion[]>([])

    const {documents: {active_document, active_note}} = useGlobalHomeState()
    const recordMultipleChoiceQuizReview = React.useCallback((session_records: Map<string, boolean> | null) => {
        if (!session_records) {
            StandardConsole.warn('Quiz ended before completion, no review recorded')
            return
        }

        if (!active_document) {
            StandardConsole.warn('No active document to review in the quiz tab')
            return
        }
        // calculate the review score
        const score = Array.from(session_records.values()).filter(v => v).length / session_records.size

        setActiveLayer(QuizTabLayerKey.SETUP);
        recordNoteReviewService({
            document_id: active_document.id,
            note_id: active_note ?? '1',
            review_type: NoteReviewType.MULTIPLE_CHOICE_QUESTIONS,
            // sum of true values divided by total number of questions
            score
        }).then()

    }, [active_document, setActiveLayer, active_note]);

    const recordOpenChoiceQuizReview = React.useCallback((session_records: Map<string, OpenEndedQuestionAssessment> | null) => {
        if (!session_records) {
            StandardConsole.warn('Quiz ended before completion, no review recorded')
            return
        }

        if (!active_document) {
            StandardConsole.warn('No active document to review in the quiz tab')
            return
        }
        // calculate the review score
        const score = Array.from(session_records.values()).reduce((acc, {grade}) => acc + grade, 0) / (session_records.size * 5)

        setActiveLayer(QuizTabLayerKey.SETUP);
        recordNoteReviewService({
            document_id: active_document.id,
            note_id: active_note ?? '1',
            review_type: NoteReviewType.OPEN_ENDED_QUESTIONS,
            // sum of scores divided by total number of questions
            score
        }).then()

    }, [active_document, setActiveLayer, active_note]);

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
                                completeSession={recordMultipleChoiceQuizReview}/>
                        ) : (
                            <OpenEndedQuizSessionLayer
                                w={'100%'} h={'100%'}
                                questions={questions as OpenEndedQuestion[]}
                                completeSession={recordOpenChoiceQuizReview}/>
                        ))}
                </React.Fragment>
            ) : (
                <PiPlainText value={'Select a document to perform a quiz'}/>
            )}
        </VStack>
    )
}
