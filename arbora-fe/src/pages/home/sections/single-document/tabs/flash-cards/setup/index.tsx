import React from 'react';
import {BoxProps, Center, VStack} from "@chakra-ui/react";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import {getFlashCardsService} from "../../../../../../../core/services/ai/AIServices.ts";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import useActiveContent from "../../../../../../../core/redux/home/hooks/useActiveContent.tsx";
import TreeAnimationLoaderV2 from "../../../../../../../core/graphics/loaders/TreeAnimationLoaderV2.tsx";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";
import CardGenerationForm, {CardGenFormObject} from "./CardGenerationForm.tsx";

interface FlashCardsSetupLayerProps extends BoxProps {
    reviewFlashCards: (cards: FlashCard[]) => void

}

export default function FlashCardsSetupLayer({reviewFlashCards, ...box_props}: FlashCardsSetupLayerProps) {
    const [generating_flash_cards, setGeneratingFlashCards] = React.useState<boolean>(false)

    const active_content = useActiveContent()
    const handleOnClickGenerateCards = React.useCallback(async ({no_of_cards}: CardGenFormObject) => {
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

    }, [reviewFlashCards, active_content, setGeneratingFlashCards]);

    return (
        <Center w={'100%'} h={'calc(100% - 40px)'} mb={'1rem'} mt={'0.5rem'} {...box_props}>
            {!generating_flash_cards ? (
                <VStack w={'40%'} h={'100%'} justify={'center'} rounded={'10px'} bg={ARBORA_GREEN.bg} p={'1rem'}>
                    <CardGenerationForm
                        initial_values={{no_of_cards: 10}}
                        submit_disabled={!active_content}
                        submitFunction={handleOnClickGenerateCards}/>
                </VStack>
            ) : (
                <TreeAnimationLoaderV2 text={'Generating Flash Cards'} pb={'5rem'}/>
            )}
        </Center>
    )
}