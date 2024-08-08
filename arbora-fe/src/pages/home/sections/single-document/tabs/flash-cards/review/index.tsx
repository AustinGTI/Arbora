import {BoxProps, HStack} from "@chakra-ui/react";
import React from "react";
import CardReviewProgressSection from "./CardReviewProgressSection.tsx";
import FlashCardSection from "./FlashCardSection.tsx";
import CardReviewCompleteOverlay from "./ReviewCompleteOverlay.tsx";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import PiDivider from "../../../../../../../pillars-ui/components/layout/PiDivider.tsx";


interface FlashCardReviewProps extends BoxProps {
    flash_cards: FlashCard[];
    completeReview: (card_review_records: Map<string, number[]>) => void
}

export const FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY = 5
export default function FlashCardsReviewLayer({flash_cards, completeReview, ...box_props}: FlashCardReviewProps) {
    const [overlay_visible, setOverlayVisible] = React.useState<boolean>(false)

    const flash_cards_map: Map<string, FlashCard> = React.useMemo(() => {
        const map = new Map<string, FlashCard>()
        flash_cards.forEach(card => {
            map.set(card.id, card)
        })
        return map
    }, [flash_cards]);

    const [card_reviews, setCardReviews] = React.useState<Map<string, number[]>>(() => {
        const map = new Map<string, number[]>()
        flash_cards.forEach(card => {
            map.set(card.id, [])
        })
        return map
    })

    const [card_stack, setCardStack] = React.useState<string[]>(flash_cards.map(card => card.id))

    /**
     * Handle the review of a card.
     * first remove the card from the stack
     * if the difficulty is below the threshold, remove the card from the remaining cards
     * if the difficulty is above the threshold, add the card to the failed cards and add it to the end of the stack
     * update the card reviews
     */
    const handleReviewCard = React.useCallback((difficulty: number) => {
        if (card_stack.length === 0) {
            return
        }
        const current_card_id = card_stack[0]
        const new_card_stack = [...card_stack]
        new_card_stack.shift()

        if (difficulty >= FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY) {
            new_card_stack.push(current_card_id)
        }

        setCardStack(new_card_stack)

        const new_card_reviews = new Map(card_reviews)
        const current_card_reviews = new_card_reviews.get(current_card_id)!
        new_card_reviews.set(current_card_id, [...current_card_reviews, difficulty])

        setCardReviews(new_card_reviews)
    }, [card_stack, setCardStack, setCardReviews, card_reviews]);

    // place the card at the top of the stack, remove it from the stack if there
    const setActiveCard = React.useCallback((id: string) => {

        const new_card_stack = [id, ...card_stack.filter(card_id => card_id !== id)]
        setCardStack(new_card_stack)
    }, [card_stack, setCardStack]);

    const restartReview = React.useCallback(() => {
        setCardStack(flash_cards.map(card => card.id))
        setCardReviews(new Map<string, number[]>(flash_cards.map(card => [card.id, []])))
        setOverlayVisible(false)
    }, [setCardStack, flash_cards, setCardReviews, setOverlayVisible]);

    const active_card: FlashCard | null = React.useMemo(() => {
        return flash_cards_map.get(card_stack[0]) ?? null
    }, [flash_cards_map, card_stack]);

    React.useEffect(() => {
        if (!active_card) {
            setOverlayVisible(true)
        }
    }, [active_card]);

    return (
        <HStack position={'relative'} overflowY={'hidden'} {...box_props}>
            {overlay_visible && (
                <CardReviewCompleteOverlay
                    card_review_records={card_reviews}
                    completeReview={() => completeReview(card_reviews)}
                    restartReview={restartReview}
                    w={'100%'} h={'100%'}/>
            )}
            <CardReviewProgressSection
                w={'30%'} h={'100%'}
                active_card={active_card}
                flash_cards={flash_cards}
                card_reviews={card_reviews}
                setActiveCard={setActiveCard}
                endSession={() => completeReview(card_reviews)}
            />
            <PiDivider orientation={'vertical'} length={'80%'} mx={'1rem'}/>
            <FlashCardSection
                w={'calc(70% - 2rem - 3px)'} h={'100%'}
                active_card={active_card}
                handleCardReview={handleReviewCard}/>
        </HStack>
    )
}