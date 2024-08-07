import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import PiTextInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextInput.tsx";
import PiInputLabel from "../../../../../../../pillars-ui/components/forms/inputs/helper-components/PiInputLabel.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import {ButtonOnClickFunction} from "../../../../../../../pillars-ui/components/buttons/types.ts";
import {getFlashCardsService} from "../../../../../../../core/services/ai/AIServices.ts";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import useActiveContent from "../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import TreeAnimationLoader from "../../../../../../../core/graphics/loaders/TreeAnimationLoader.tsx";

interface FlashCardsSetupLayerProps extends BoxProps {
    reviewFlashCards: (cards: FlashCard[]) => void

}

export default function FlashCardsSetupLayer({reviewFlashCards, ...box_props}: FlashCardsSetupLayerProps) {
    const [no_of_cards, setNoOfCards] = React.useState<number>(25)
    const [generating_flash_cards, setGeneratingFlashCards] = React.useState<boolean>(false)

    const active_content = useActiveContent()
    const handleOnClickReviewFlashCards: ButtonOnClickFunction = React.useCallback(async () => {
        // if there is no active document, return
        if (!active_content) {
            StandardConsole.warn('Could not locate active content')
            return
        }
        setGeneratingFlashCards(true)

        const response = await getFlashCardsService({
            no_of_flash_cards: no_of_cards,
            content: active_content
        })
        if (response.is_successful) {
            reviewFlashCards(response.data!.flash_cards)
        }
        setGeneratingFlashCards(false)

    }, [reviewFlashCards, no_of_cards, active_content, setGeneratingFlashCards]);

    return (
        <Center w={'100%'} h={'100%'} {...box_props}>
            {!generating_flash_cards ? (
                <VStack w={'40%'} h={'75%'} justify={'space-around'}>
                    <VStack w={'100%'} align={'center'}>
                        <PiInputLabel m={0} name={'no_of_cards'} label={'Number of Cards'}
                                      container_props={{w: undefined}}/>
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
                            label={'Generate Flash Cards'}
                            isDisabled={no_of_cards <= 0}
                            onClick={handleOnClickReviewFlashCards}/>
                    </Center>
                </VStack>
            ) : (
                <TreeAnimationLoader text={'Generating Flash Cards'} pb={'5rem'}/>
            )}
        </Center>
    )
}