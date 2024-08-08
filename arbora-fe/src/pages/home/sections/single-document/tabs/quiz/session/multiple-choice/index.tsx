import React from "react";
import {BoxProps, HStack} from "@chakra-ui/react";
import MultipleChoiceProgressSection from "./MultipleChoiceProgressSection.tsx";
import MultipleChoiceQuestionSection from "./MultipleChoiceQuestionSection.tsx";
import {MultipleChoiceQuestion} from "../../../../../../../../core/services/ai/types.ts";
import MultipleChoiceQuizCompleteOverlay from "./MultipleChoiceQuizCompleteOverlay.tsx";
import PiDivider from "../../../../../../../../pillars-ui/components/layout/PiDivider.tsx";

interface MultipleChoiceQuizSessionLayerProps extends BoxProps {
    questions: MultipleChoiceQuestion[]
    completeSession: (quiz_session_records: Map<string, boolean> | null) => void
}

export default function MultipleChoiceQuizSessionLayer
({
     questions, completeSession, ...box_props
 }: MultipleChoiceQuizSessionLayerProps) {
    const [is_grading, setIsGrading] = React.useState<boolean>(false)

    const [review_mode, setReviewMode] = React.useState<boolean>(false)

    const [overlay_visible, setOverlayVisible] = React.useState<boolean>(false)

    const [active_question_idx, setActiveQuestionIdx] = React.useState<number>(0)

    const [answers, setAnswers] = React.useState<Map<string, number>>(new Map(questions.map(question => [question.id, -1])))

    const [performance, setPerformance] = React.useState<Map<string, boolean> | null>(null)


    const gradeQuiz = React.useCallback(async () => {
        setIsGrading(true)
        setOverlayVisible(true)
        // no need to delay but it looks better and is consistent with open ended questions
        await new Promise(resolve => setTimeout(resolve, 3000))
        const performance = new Map<string, boolean>()
        questions.forEach(question => {
            performance.set(question.id, answers.get(question.id) === question.correct_choice)
        })

        setPerformance(performance)
        setIsGrading(false)

    }, [questions, answers, setPerformance, setOverlayVisible, setIsGrading]);
    const nextQuestion = React.useCallback(() => {
        const questions_done = Array.from(answers.values()).filter(answer => answer !== -1).length
        if (questions_done === questions.length) {
            gradeQuiz().then()
            return
        }

        if (active_question_idx === questions.length - 1) {
            return
        }

        setActiveQuestionIdx(active_question_idx + 1)
    }, [active_question_idx, setActiveQuestionIdx, questions.length, answers, gradeQuiz]);

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

    return (
        <HStack position={'relative'} overflow={'hidden'} {...box_props}>
            {overlay_visible && (
                <MultipleChoiceQuizCompleteOverlay
                    is_loading={is_grading}
                    performance={performance}
                    completeSession={completeSession}
                    restartSession={restartSession}
                    reviewSession={reviewSession}/>
            )}
            <MultipleChoiceProgressSection
                active_question_idx={active_question_idx}
                questions={questions}
                performance={performance}
                answers={answers}
                nextQuestion={nextQuestion}
                setActiveQuestionIdx={setActiveQuestionIdx}
                endSession={() => completeSession(performance)}
                h={'100%'} w={'30%'}
            />
            <PiDivider orientation={'vertical'} length={'80%'} mx={'1rem'}/>
            <MultipleChoiceQuestionSection
                w={'calc(70% - 2rem - 3px)'} h={'100%'}
                answer={answers.get(questions[active_question_idx].id) ?? -1}
                active_question_index={active_question_idx}
                review_mode={review_mode}
                active_question={questions[active_question_idx]}
                setAnswer={(answer) => {
                    const new_answers = new Map(answers)
                    new_answers.set(questions[active_question_idx].id, answer)
                    setAnswers(new_answers)
                }}/>
        </HStack>
    )
}