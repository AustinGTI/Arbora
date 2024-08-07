import {VStack} from "@chakra-ui/react";
import FlashCardsReviewLayer from "./review";
import React from "react";
import FlashCardsSetupLayer from "./setup";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import ActiveDocumentNoteSelector from "../../../../../../core/components/document-note-selector";
import {FlashCard} from "../../../../../../core/services/ai/types.ts";
import {recordNoteReviewService} from "../../../../../../core/services/documents/DocumentsCRUDServices.ts";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {NoteReviewType} from "../../../../../../core/services/documents/types.ts";
import ArboraNoDataGraphic from "../../../../../../core/graphics/ArboraNoDataGraphic.tsx";

enum FlashCardsTabLayerKey {
    REVIEW = 'review',
    SETUP = 'setup'
}

export default function DocumentViewFlashCardsTab() {
    const [active_layer, setActiveLayer] = React.useState<FlashCardsTabLayerKey>(FlashCardsTabLayerKey.SETUP)
    const [flash_cards, setFlashCards] = React.useState<FlashCard[]>([])

    const {documents: {active_document, active_note}} = useGlobalHomeState()

    const recordFlashCardsReview = React.useCallback((review_records: Map<string, number[]>) => {
        if (!active_document) {
            StandardConsole.warn('No active document to review in the flash cards tab')
            return
        }
        // calculate the review score
        // difficulty is on a 1-5 scale so 6 - difficulty is a good proxy for the score then summed up and divided by total * 5
        const score = Array.from(review_records.values()).map(v => 6 - v[v.length - 1]).reduce((a, b) => a + b, 0) / (review_records.size * 5)

        setActiveLayer(FlashCardsTabLayerKey.SETUP);
        recordNoteReviewService({
            document_id: active_document.id,
            note_id: active_note ?? '1',
            review_type: NoteReviewType.FLASH_CARDS,
            score
        }).then()

    }, [active_document, setActiveLayer, active_note]);

    return (
        <VStack bg={'white'} w={'100%'} h={'100%'} px={'1rem'}>
            {active_document ? (
                <React.Fragment>
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
                            completeReview={recordFlashCardsReview}
                        />
                    )}
                </React.Fragment>
            ) : (
                <ArboraNoDataGraphic text={'Select a document to create flashcards.'}/>
            )}
        </VStack>
    )
}