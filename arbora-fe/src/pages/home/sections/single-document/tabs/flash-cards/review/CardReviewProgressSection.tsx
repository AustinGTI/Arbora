import {BoxProps, HStack, VStack} from "@chakra-ui/react";
import {FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY} from "./index.tsx";
import React from "react";
import CircularProgressIndicator
    from "../../../../../../../pillars-ui/components/data_views/CircularProgressIndicator.tsx";
import GridDataView, {GridCellData} from "../../../../../../../pillars-ui/components/data_views/GridDataView.tsx";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";

interface ProgressSectionProps extends BoxProps {
    flash_cards: FlashCard[]
    card_reviews: Map<string, number[]>
    setActiveCard: (card_id: string) => void
}


export default function CardReviewProgressSection
({
     flash_cards, card_reviews, setActiveCard, ...box_props
 }: ProgressSectionProps) {

    const cards_done: number = React.useMemo(() => {
        return Array.from(card_reviews.values()).filter(reviews => reviews.length && reviews.slice(-1)[0] < FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY).length
    }, [card_reviews]);

    const grid_data: GridCellData[] = React.useMemo(() => {
        return flash_cards.map(({id}) => {
            // if in cards remaining, gray, if in cards failed, red, if in neither, green
            let bg_color;
            if (!card_reviews.get(id)?.length) {
                bg_color = 'gray'
            } else if (card_reviews.get(id)!.slice(-1)[0] >= FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY) {
                bg_color = 'red'
            } else {
                bg_color = 'green'
            }
            return {
                key: id,
                color: bg_color,
                onClick: () => setActiveCard(id)
            }
        })
    }, [flash_cards, card_reviews, setActiveCard]);

    return (
        <VStack h={'100%'} justify={'space-between'} p={'0.5rem'} {...box_props}>
            <GridDataView grid_data={grid_data}/>
            <HStack w={'100%'} justify={'center'} py={'2rem'} flex={1}>
                <CircularProgressIndicator percentage={Math.round((cards_done / card_reviews.size) * 100)} size={100}/>
            </HStack>
        </VStack>

    )
}
