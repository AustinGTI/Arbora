import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import React from "react";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";
// @ts-ignore
import FlashCardsIcon from "../../../../../../../assets/ai/AIFlashCardsActionV2.svg?react"

interface CardReviewCompleteOverlayProps extends BoxProps {
    card_review_records: Map<string, number[]>;
    completeReview: () => void;
    restartReview: () => void;
}

export default function CardReviewCompleteOverlay({
                                                      card_review_records,
                                                      completeReview,
                                                      restartReview,
                                                      ...box_props
                                                  }: CardReviewCompleteOverlayProps) {

    const [hard_cards, medium_cards, easy_cards] = React.useMemo(() => {
        let hards = 0
        let mediums = 0
        let easys = 0

        card_review_records.forEach((difficulties) => {
            if (difficulties.length === 0) {
                return
            }
            difficulties.forEach((difficulty) => {
                if (difficulty >= 5) {
                    hards++
                } else if (difficulty >= 3) {
                    mediums++
                } else {
                    easys++
                }
            })
        })

        return [hards, mediums, easys]
    }, [card_review_records]);

    return (
        <Center
            position={'absolute'}
            top={0} left={0}
            zIndex={1000}
            w={'100%'} h={'100%'}
            bg={ARBORA_GREEN.bg}
            {...box_props}>
            <VStack w={'50%'} spacing={'1rem'}>
                <VStack w={'100%'} py={'1rem'} justify={'center'}>
                    <FlashCardsIcon style={{
                        width: '60px', height: '60px'
                    }}/>
                    <PiPlainText value={'Review Complete'} fontSize={'32px'} fontWeight={700}/>
                    {[
                        {key: 'Easy', color: ARBORA_GREEN.loud, content: easy_cards},
                        {key: 'Medium', color: 'orange', content: medium_cards},
                        {key: 'Hard', color: '#FF033E', content: hard_cards}
                    ].map(({key, color, content}) => (
                        <HStack w={'100%'} key={key} justify={'center'}>
                            <PiPlainText value={key} fontWeight={700} fontSize={'20px'}
                                         textDecoration={'underline'} textDecorationColor={color}/>
                            <PiPlainText value={' : ' + content} fontWeight={600} fontSize={'20px'}/>
                        </HStack>
                    ))}
                </VStack>
                <HStack w={'100%'} justify={'space-around'}>
                    <PiButton label={'Review Again'} onClick={restartReview}/>
                    <PiButton label={'Complete Review'} onClick={completeReview}/>
                </HStack>
            </VStack>
        </Center>
    )
}