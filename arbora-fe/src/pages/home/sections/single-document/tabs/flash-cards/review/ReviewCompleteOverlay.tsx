import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import React from "react";

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

    const [hards, mediums, easys] = React.useMemo(() => {
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
            w={'100%'} h={'100%'}
            bg={'rgba(255,255,255,0.8)'}
            {...box_props}>
            <VStack w={'50%'} spacing={'1rem'}>
                <VStack w={'100%'} py={'1rem'} justify={'center'}>
                    <PiPlainText value={'Review Complete'} fontSize={'42px'} fontWeight={700}/>
                    <HStack w={'100%'} justify={'space-around'} py={'1rem'}>
                        <PiPlainText value={`Easy: ${easys}`}/>
                        <PiPlainText value={`Medium: ${mediums}`}/>
                        <PiPlainText value={`Hard: ${hards}`}/>
                    </HStack>
                </VStack>
                <HStack w={'100%'} justify={'space-around'}>
                    <PiButton label={'Review Again'} onClick={restartReview}/>
                    <PiButton label={'Complete Review'} onClick={completeReview}/>
                </HStack>
            </VStack>
        </Center>
    )
}