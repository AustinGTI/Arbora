import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import {FlashCard} from "../types.ts";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiInputLabel from "../../../../../../../pillars-ui/components/forms/inputs/helper-components/PiInputLabel.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";

interface FlashCardsSetupLayerProps extends BoxProps {
    reviewFlashCards: (cards: FlashCard[]) => void

}

function generateRandomFlashCards(no_of_cards: number): FlashCard[] {
    const flash_cards: FlashCard[] = []
    for (let i = 0; i < no_of_cards; i++) {
        flash_cards.push({
            id: i.toString(),
            prompt: `Prompt ${i}`,
            answer: `Answer ${i}`
        })
    }
    return flash_cards
}

export default function FlashCardsSetupLayer({reviewFlashCards, ...box_props}: FlashCardsSetupLayerProps) {
    const [no_of_cards, setNoOfCards] = React.useState<number>(25)

    const handleOnClickReviewFlashCards = React.useCallback(() => {
        // todo: some async call to fetch flash cards
        reviewFlashCards(generateRandomFlashCards(no_of_cards))
    }, [reviewFlashCards, no_of_cards]);

    return (
        <Center w={'100%'} h={'100%'} {...box_props}>
            <VStack w={'50%'} h={'75%'} justify={'space-around'}>
                <VStack w={'100%'}>
                    <PiInputLabel m={0} name={'no_of_cards'} label={'Number of Cards'}/>
                    <PiTextInput
                        type={'number'}
                        input_type={'generic'}
                        initial_value={no_of_cards}
                        onInputChange={(n) => {
                            if (n && !isNaN(n as number)) {
                                setNoOfCards(n as number)
                            }
                        }}/>
                </VStack>

                <Center w={'100%'} py={'1rem'}>
                    <PiButton
                        label={'Review Flash Cards'}
                        isDisabled={no_of_cards <= 0}
                        onClick={handleOnClickReviewFlashCards}/>
                </Center>
            </VStack>
        </Center>
    )
}