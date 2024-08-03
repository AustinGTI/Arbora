import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiInputLabel from "../../../../../../../pillars-ui/components/forms/inputs/helper-components/PiInputLabel.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import {ButtonOnClickFunction} from "../../../../../../../pillars-ui/components/buttons/types.ts";
import {getFlashCardsService} from "../../../../../../../core/services/ai/AIServices.ts";
import useGlobalHomeState from "../../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";

interface FlashCardsSetupLayerProps extends BoxProps {
    reviewFlashCards: (cards: FlashCard[]) => void

}

export default function FlashCardsSetupLayer({reviewFlashCards, ...box_props}: FlashCardsSetupLayerProps) {
    const [no_of_cards, setNoOfCards] = React.useState<number>(25)

    const {documents: {active_document, active_note}} = useGlobalHomeState()

    const handleOnClickReviewFlashCards: ButtonOnClickFunction = React.useCallback(async (setButtonLoadingState) => {
        // if there is no active document, return
        if (!active_document) {
            StandardConsole.warn('No active document to review')
            return
        }
        setButtonLoadingState(true)
        const response = await getFlashCardsService({
            no_of_flash_cards: no_of_cards,
            content: active_note ? active_document?.notes[active_note].content : active_document?.content
        })
        if (response.is_successful) {
            reviewFlashCards(response.data!.flash_cards)
        }
        setButtonLoadingState(false)
    }, [reviewFlashCards, no_of_cards, active_document, active_note]);

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