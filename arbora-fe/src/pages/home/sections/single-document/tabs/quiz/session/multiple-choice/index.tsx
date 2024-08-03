import React from "react";
import {BoxProps, HStack} from "@chakra-ui/react";
import MultipleChoiceProgressSection from "./MultipleChoiceProgressSection.tsx";
import MultipleChoiceQuestionSection from "./MultipleChoiceQuestionSection.tsx";
import {MultipleChoiceQuestion} from "../../../../../../../../core/services/ai/types.ts";
import MultipleChoiceQuizCompleteOverlay from "./MultipleChoiceQuizCompleteOverlay.tsx";

interface MultipleChoiceQuizSessionLayerProps extends BoxProps {
    questions: MultipleChoiceQuestion[]
    completeSession: (quiz_session_records: Map<string, boolean> | null) => void
}

export default function MultipleChoiceQuizSessionLayer
({
     questions, completeSession, ...box_props
 }: MultipleChoiceQuizSessionLayerProps) {
    const [review_mode, setReviewMode] = React.useState<boolean>(false)

    const [overlay_visible, setOverlayVisible] = React.useState<boolean>(false)

    const [active_question_idx, setActiveQuestionIdx] = React.useState<number>(0)

    const [answers, setAnswers] = React.useState<Map<string, number>>(new Map(questions.map(question => [question.id, -1])))

    const [performance, setPerformance] = React.useState<Map<string, boolean> | null>(null)

    const nextQuestion = React.useCallback(() => {
        setActiveQuestionIdx(active_question_idx + 1)
    }, [active_question_idx, setActiveQuestionIdx]);

    const gradeQuiz = React.useCallback(() => {
        const performance = new Map<string, boolean>()
        questions.forEach(question => {
            performance.set(question.id, answers.get(question.id) === question.correct_choice)
        })
        setPerformance(performance)
        setOverlayVisible(true)
    }, [questions, answers, setPerformance, setOverlayVisible]);

    const restartSession = React.useCallback(() => {
        setReviewMode(false)
        setAnswers(new Map(questions.map(question => [question.id, -1])))
        setPerformance(null)
        setActiveQuestionIdx(0)
        setOverlayVisible(false)
    }, [setAnswers, questions, setPerformance, setActiveQuestionIdx, setOverlayVisible, setReviewMode]);

    const reviewSession = React.useCallback(() => {
        if (!performance) return
        setReviewMode(true)
        setOverlayVisible(false)
        // go to the first failed question if there is one
        const failed_question = Array.from(performance!.entries()).find(([_id, performance]) => !performance)
        if (failed_question) {
            setActiveQuestionIdx(questions.findIndex(question => question.id === failed_question[0]))
        }
    }, [performance, setReviewMode, setOverlayVisible, setActiveQuestionIdx, questions]);

    React.useEffect(() => {
        if (active_question_idx === questions.length) {
            gradeQuiz()
        }
    }, [active_question_idx]);

    return (
        <HStack position={'relative'} {...box_props}>
            {overlay_visible && (
                <MultipleChoiceQuizCompleteOverlay
                    is_loading={false}
                    quiz_performance={performance}
                    completeSession={completeSession}
                    restartSession={restartSession}
                    reviewSession={reviewSession}/>
            )}
            <MultipleChoiceProgressSection
                active_question_idx={active_question_idx}
                questions={questions}
                performance={performance}
                answers={answers}
                setActiveQuestionIdx={setActiveQuestionIdx}
                endSession={() => completeSession(performance)}
                h={'100%'} w={'35%'}
            />
            <MultipleChoiceQuestionSection
                review_mode={review_mode}
                active_question={questions[active_question_idx]}
                is_last_question={active_question_idx === questions.length - 1}
                setAnswer={(answer) => {
                    const new_answers = new Map(answers)
                    new_answers.set(questions[active_question_idx].id, answer)
                    setAnswers(new_answers)
                    nextQuestion()
                }} h={'100%'} w={'60%'}/>
        </HStack>
    )
}