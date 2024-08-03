import {VStack} from "@chakra-ui/react";
import FlashCardsReviewLayer from "./review";
import React from "react";
import FlashCardsSetupLayer from "./setup";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";
import {FlashCard} from "../../../../../../core/services/ai/types.ts";

enum FlashCardsTabLayerKey {
    REVIEW = 'review',
    SETUP = 'setup'
}

export default function DocumentViewFlashCardsTab() {
    // const {
    //     documents: {active_document, active_note},
    //     document_view: {
    //         tab_data: {editor_data: {content}}
    //     }
    // } = useGlobalHomeState()

    const [active_layer, setActiveLayer] = React.useState<FlashCardsTabLayerKey>(FlashCardsTabLayerKey.SETUP)
    const [flash_cards, setFlashCards] = React.useState<FlashCard[]>([])

    return (
        <VStack bg={'white'} w={'100%'} h={'100%'} px={'1rem'}>
            <ActiveDocumentNoteSelector w={'100%'} py={'1rem'}
                                        is_disabled={active_layer === FlashCardsTabLayerKey.REVIEW}/>
            {active_layer === FlashCardsTabLayerKey.SETUP && (
                <FlashCardsSetupLayer
                    w={'100%'} h={'100%'}
                    reviewFlashCards={(cards) => {
                        setFlashCards(cards)
                        setActiveLayer(FlashCardsTabLayerKey.REVIEW);
                    }}/>
            )}
            {active_layer === FlashCardsTabLayerKey.REVIEW && (
                <FlashCardsReviewLayer
                    w={'100%'} h={'100%'}
                    flash_cards={flash_cards}
                    completeReview={(review_records) => {
                        setActiveLayer(FlashCardsTabLayerKey.SETUP);
                        StandardConsole.log('Review Complete', review_records)
                    }}
                />
            )}
        </VStack>
    )
}