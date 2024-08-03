import React from 'react';
import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";

interface MultipleChoiceQuizCompleteOverlayProps extends BoxProps {
    is_loading: boolean
    quiz_performance: Map<string, boolean> | null
    completeSession: (quiz_session_records: Map<string, boolean>) => void
    restartSession: () => void
    reviewSession: () => void
}

export default function MultipleChoiceQuizCompleteOverlay
({
     is_loading, quiz_performance, completeSession, restartSession,
     reviewSession, ...box_props
 }: MultipleChoiceQuizCompleteOverlayProps) {
    const correct_answers: number = React.useMemo(() => {
        if (!quiz_performance) return 0
        return Array.from(quiz_performance.values()).filter(performance => {
            return performance
        }).length
    }, [quiz_performance]);

    return (
        <Center
            position={'absolute'}
            top={0} left={0}
            w={'100%'} h={'100%'}
            bg={'rgba(255,255,255,0.8)'}
            {...box_props}>
            {!is_loading && quiz_performance ? (
                <VStack w={'50%'} spacing={'1rem'}>
                    <VStack w={'100%'} py={'1rem'} justify={'center'}>
                        <PiPlainText value={'Quiz Complete'} fontSize={'42px'} fontWeight={700}/>
                        <VStack w={'100%'} justify={'center'} align={'center'} py={'1rem'}>
                            <PiPlainText value={`${correct_answers} / ${quiz_performance.size}`}/>
                            <PiPlainText value={`${Math.round(correct_answers / quiz_performance.size * 100)}%`}/>
                        </VStack>
                    </VStack>
                    <HStack w={'100%'} justify={'space-around'}>
                        <PiButton label={'Review Quiz'} onClick={reviewSession}/>
                        <PiButton label={'Try Again'} onClick={restartSession}/>
                        <PiButton label={'End Session'} onClick={() => completeSession(quiz_performance)}/>
                    </HStack>
                </VStack>
            ) : (
                <PiPlainText value={'Grading Quiz...'} fontSize={'42px'} fontWeight={700}/>
            )}
        </Center>
    )
}
