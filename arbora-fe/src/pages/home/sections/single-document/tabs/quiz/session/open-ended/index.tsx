import React from 'react';
import {BoxProps, HStack} from "@chakra-ui/react";
import OpenEndedQuestionSection from "./OpenEndedQuestionSection.tsx";
import {OpenEndedQuestion, OpenEndedQuestionAssessment} from "../../../../../../../../core/services/ai/types.ts";
import {gradeOpenEndedQuestionsService} from "../../../../../../../../core/services/ai/AIServices.ts";
import {StandardConsole} from "../../../../../../../../core/helpers/logging.ts";
import useActiveContent from "../../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import OpenEndedProgressSection from "./OpenEndedProgressSection.tsx";
import OpenEndedQuizCompleteOverlay from "./OpenEndedQuizCompleteOverlay.tsx";

interface OpenQuizSessionLayerProps extends BoxProps {
    questions: OpenEndedQuestion[]
    completeSession: (quiz_session_records: Map<string, OpenEndedQuestionAssessment> | null) => void
}

export function OpenEndedQuizSessionLayer
({
     questions, completeSession, ...box_props
 }: OpenQuizSessionLayerProps) {
    const [review_mode, setReviewMode] = React.useState<boolean>(false)

    const [grading_quiz, setGradingQuiz] = React.useState<boolean>(false)

    const [overlay_visible, setOverlayVisible] = React.useState<boolean>(false)

    const [active_question_idx, setActiveQuestionIdx] = React.useState<number>(0)

    const [answers, setAnswers] = React.useState<Map<string, string>>(new Map(questions.map(question => [question.id, ""])))

    const [performance, setPerformance] = React.useState<Map<string, OpenEndedQuestionAssessment> | null>(null)

    const active_content = useActiveContent()

    const gradeQuiz = React.useCallback(async () => {
        setOverlayVisible(true)
        setGradingQuiz(true)

        if (!active_content) {
            StandardConsole.warn('No active document to review in the open ended quiz grading function')
            return
        }

        // todo: send the answers to the server to grade by LLM for now set random performance
        await gradeOpenEndedQuestionsService({
            content: active_content,
            questions,
            // sort answers by question id order
            answers: questions.map(({id}) => answers.get(id)!)
        }).then(response => {
            if (response.is_successful) {
                setPerformance(new Map(response.data!.grading.map((assessment) => [assessment.id, assessment])))
            } else {
                StandardConsole.error('Failed to grade open ended questions')
            }
        })

        setGradingQuiz(false)

    }, [setPerformance, setOverlayVisible, setGradingQuiz, questions, active_content, answers]);

    const nextQuestion = React.useCallback(() => {
        setActiveQuestionIdx(active_question_idx + 1)
    }, [active_question_idx, setActiveQuestionIdx]);

    const restartSession = React.useCallback(() => {
        setReviewMode(false)
        setAnswers(new Map(questions.map(question => [question.id, ""])))
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
    }, [setReviewMode, setOverlayVisible, performance, setActiveQuestionIdx, questions]);

    React.useEffect(() => {
        if (active_question_idx === questions.length) {
            gradeQuiz().then()
        }
    }, [active_question_idx]);

    return (
        <HStack position={'relative'} {...box_props}>
            {overlay_visible && (
                <OpenEndedQuizCompleteOverlay
                    is_loading={grading_quiz}
                    performance={performance}
                    completeSession={completeSession}
                    restartSession={restartSession}
                    reviewSession={reviewSession}/>
            )}
            <OpenEndedProgressSection
                active_question_idx={active_question_idx}
                performance={performance}
                questions={questions}
                answers={answers}
                setActiveQuestionIdx={setActiveQuestionIdx}
                endSession={() => completeSession(performance)}
                h={'100%'} w={'35%'}
            />
            <OpenEndedQuestionSection
                answers={answers}
                review_mode={review_mode}
                active_question={questions[active_question_idx]}
                is_last_question={active_question_idx === questions.length - 1}
                performance={performance}
                setAnswer={(answer) => {
                    nextQuestion()
                    const new_answers = new Map(answers)
                    new_answers.set(questions[active_question_idx].id, answer)
                    setAnswers(new_answers)
                    if (active_question_idx === questions.length - 1) {
                        gradeQuiz().then()
                        return
                    }
                }} w={'60%'} h={'100%'}/>
        </HStack>

    )
}

