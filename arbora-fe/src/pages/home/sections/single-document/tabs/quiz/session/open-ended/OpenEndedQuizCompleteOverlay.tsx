import React from 'react'
import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {OpenEndedQuestionAssessment} from "../../../../../../../../core/services/ai/types.ts";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";

interface OpenEndedQuizCompleteOverlayProps extends BoxProps {
    is_loading: boolean
    performance: Map<string, OpenEndedQuestionAssessment> | null
    completeSession: (quiz_session_records: Map<string, OpenEndedQuestionAssessment>) => void
    restartSession: () => void
    reviewSession: () => void
}

export default function OpenEndedQuizCompleteOverlay
({
     is_loading, performance, completeSession, restartSession,
     reviewSession, ...box_props
 }: OpenEndedQuizCompleteOverlayProps) {

    const total_score: number = React.useMemo(() => {
        if (!performance) return 0
        return Array.from(performance.values()).reduce((acc, assessment) => {
            return acc + assessment.grade
        }, 0)
    }, [performance]);

    return (
        <Center
            position={'absolute'}
            top={0} left={0}
            w={'100%'} h={'100%'}
            bg={'rgba(255,255,255,0.8)'}
            {...box_props}>
            {!is_loading && performance ? (
                <VStack w={'50%'} spacing={'1rem'}>
                    <VStack w={'100%'} py={'1rem'} justify={'center'}>
                        <PiPlainText value={'Quiz Complete'} fontSize={'42px'} fontWeight={700}/>
                        <VStack w={'100%'} justify={'center'} align={'center'} py={'1rem'}>
                            <PiPlainText value={`${total_score} / ${performance.size * 5}`}/>
                            <PiPlainText value={`${Math.round(total_score / (performance.size * 5) * 100)}%`}/>
                        </VStack>
                    </VStack>
                    <HStack w={'100%'} justify={'space-around'}>
                        <PiButton label={'Review Quiz'} onClick={reviewSession}/>
                        <PiButton label={'Try Again'} onClick={restartSession}/>
                        <PiButton label={'End Session'} onClick={() => completeSession(performance)}/>
                    </HStack>
                </VStack>
            ) : (
                <PiPlainText value={'Grading Quiz...'} fontSize={'42px'} fontWeight={700}/>
            )}
        </Center>
    )
}
