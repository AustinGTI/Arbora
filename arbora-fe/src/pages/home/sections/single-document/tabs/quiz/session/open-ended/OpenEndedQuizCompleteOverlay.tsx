import React from 'react'
import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {OpenEndedQuestionAssessment} from "../../../../../../../../core/services/ai/types.ts";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import TreeAnimationLoaderV2 from "../../../../../../../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";
import {ARBORA_GREEN, ARBORA_RED} from "../../../../../../../../core/constants/styling.ts";
// @ts-ignore
import QuizIcon from "../../../../../../../../assets/ai/AIQuizAction.svg?react"

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

    const [final_score, max_possible_score, score_color] = React.useMemo(() => {
        if (!performance) return [0, 0, ARBORA_RED.loud]
        const max_possible_score = performance.size * 5;
        let score = 0;
        Array.from(performance.keys()).forEach((id) => {
            score += performance?.get(id)!.grade || 0;
        });
        let color = ARBORA_RED.loud;

        switch (score / max_possible_score) {
            case 0.3:
                color = '#FFA500';  // Orange
                break;
            case 0.7:
                color = ARBORA_GREEN.loud;
                break;
        }

        return [score, max_possible_score, color]
    }, [performance]);

    return (
        <Center
            position={'absolute'}
            top={0} left={'1rem'}
            w={'calc(100% - 2rem)'} h={'calc(100% - 1rem)'}
            zIndex={1000} rounded={'1rem'}
            bg={ARBORA_GREEN.bg}
            {...box_props}>
            {!is_loading && performance ? (
                <VStack w={'50%'} spacing={'1rem'}>
                    <VStack w={'100%'} py={'1rem'} justify={'center'}>
                        <QuizIcon style={{
                            width: '60px', height: '60px'
                        }}/>
                        <PiPlainText value={'Quiz Complete'} fontSize={'32px'} fontWeight={700}/>
                        <VStack w={'100%'} py={'1rem'} align={'center'}>
                            {[
                                {
                                    key: 'Score',
                                    color: score_color,
                                    content: `${final_score}/${max_possible_score}`
                                },
                                {
                                    key: '%',
                                    color: score_color,
                                    content: `${Math.round((final_score / max_possible_score) * 100)}%`
                                },
                            ].map(({key, color, content}) => (
                                <HStack w={'100%'} key={key} justify={'center'}>
                                    <PiPlainText value={key} fontWeight={700} fontSize={'20px'}
                                                 textDecoration={'underline'} textDecorationColor={color}/>
                                    <PiPlainText value={' : ' + content} fontWeight={600} fontSize={'20px'}/>
                                </HStack>
                            ))}
                        </VStack>
                    </VStack>
                    <HStack w={'100%'} justify={'space-around'}>
                        <PiButton label={'Review Quiz'} onClick={reviewSession}/>
                        <PiButton label={'Try Again'} onClick={restartSession}/>
                        <PiButton label={'End Session'} onClick={() => completeSession(performance)}/>
                    </HStack>
                </VStack>
            ) : (
                <TreeAnimationLoaderV2 text={'Grading Quiz'}/>
            )}
        </Center>
    )
}
