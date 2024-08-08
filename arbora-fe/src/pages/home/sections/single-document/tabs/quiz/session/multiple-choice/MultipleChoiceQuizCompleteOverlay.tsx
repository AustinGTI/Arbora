import React from 'react';
import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {ARBORA_GREEN} from "../../../../../../../../core/constants/styling.ts";
// @ts-ignore
import QuizIcon from "../../../../../../../../assets/ai/AIQuizAction.svg?react"
import TreeAnimationLoaderV2 from "../../../../../../../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";

interface MultipleChoiceQuizCompleteOverlayProps extends BoxProps {
    is_loading: boolean
    performance: Map<string, boolean> | null
    completeSession: (quiz_session_records: Map<string, boolean>) => void
    restartSession: () => void
    reviewSession: () => void
}

export default function MultipleChoiceQuizCompleteOverlay
({
     is_loading, performance, completeSession, restartSession,
     reviewSession, ...box_props
 }: MultipleChoiceQuizCompleteOverlayProps) {
    const [correctly_answered, wrongly_answered] = React.useMemo(() => {
        if (!performance) return [0, 0]
        let correct = 0;
        let wrong = 0;
        performance.forEach((is_correct) => {
            if (is_correct) {
                correct++
            } else {
                wrong++
            }
        });
        return [correct, wrong]
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
                                {key: 'Correct', color: ARBORA_GREEN.loud, content: correctly_answered},
                                {key: 'Wrong', color: 'red', content: wrongly_answered},
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
