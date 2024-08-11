import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY} from "./index.tsx";
import React from "react";
import GridDataView, {GridCellData} from "../../../../../../../pillars-ui/components/data_views/GridDataView.tsx";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {FaArrowLeft} from "react-icons/fa";
import PiDivider from "../../../../../../../pillars-ui/components/layout/PiDivider.tsx";

interface ProgressSectionProps extends BoxProps {
    active_card: FlashCard | null
    flash_cards: FlashCard[]
    card_reviews: Map<string, number[]>
    setActiveCard: (card_id: string) => void
    endSession: () => void
}

function getCellColor(difficulty: number): string {
    switch (difficulty) {
        case 1:
        case 2:
            return ARBORA_GREEN.loud
        case 3:
        case 4:
            return 'orange'
        case 5:
            return '#FF033E'
        default:
            return ARBORA_GREEN.hard
    }
}

export default function CardReviewProgressSection
({
     active_card, flash_cards, card_reviews, setActiveCard, endSession, ...box_props
 }: ProgressSectionProps) {

    const grid_data: GridCellData[] = React.useMemo(() => {
        return flash_cards.map(({id}) => {
            // if in cards remaining, gray, if in cards failed, red, if in neither, green
            const difficulty = card_reviews.get(id)?.slice(-1)[0] || 0
            const cell_color = getCellColor(difficulty)
            return {
                key: id,
                color: cell_color,
                onClick: () => setActiveCard(id),
                content: (
                    <Center position={'relative'} w={'100%'} h={'100%'}>
                        {active_card?.id === id && (
                            <Box position={'absolute'} top={0} left={0} w={'100%'} h={'100%'} rounded={'7px'}
                                 borderColor={'black'} borderWidth={'7px'}/>
                        )}
                        {/*{card_reviews.get(id)?.length ? (*/}
                        {/*    <Box w={'60%'} h={'60%'} rounded={'3px'} bg={cell_color}/>*/}
                        {/*) : null}*/}
                    </Center>
                )
            }
        })
    }, [flash_cards, card_reviews, setActiveCard, active_card?.id]);

    const [cards_done, total_cards] = React.useMemo(() => {
        const total_cards = flash_cards.length
        const cards_done = Array.from(card_reviews.values()).filter(reviews => reviews.length && reviews.slice(-1)[0] < FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY).length
        return [cards_done, total_cards]
    }, [flash_cards.length, card_reviews]);

    const [hard_cards, medium_cards, easy_cards] = React.useMemo(() => {
        let hards = 0
        let mediums = 0
        let easys = 0

        card_reviews.forEach((difficulties) => {
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
    }, [card_reviews]);

    return (
        <VStack
            position={'relative'}
            h={'100%'} justify={'space-between'}
            px={'1rem'} {...box_props}>
            <Center position={'absolute'} p={'1rem'} top={1} left={1}>
                <PiButton
                    onClick={endSession}
                    icon_props={{fontSize: '20px'}}
                    confirmation_message={'Are you sure you want to leave before reviewing all the flash cards?'}
                    icon={FaArrowLeft}/>
            </Center>
            <VStack
                p={'0.5rem'}
                w={'100%'} h={'calc(100% - 2rem)'} mb={'1.5rem'} mt={'0.5rem'}
                rounded={'10px'} bg={ARBORA_GREEN.bg}>
                <VStack w={'100%'} pt={'1rem'} align={'center'} spacing={0}>
                    <PiPlainText value={`${cards_done}/${total_cards}`} fontSize={'22px'} fontWeight={600}/>
                    <PiPlainText value={'Reviewed'} fontWeight={700}/>
                </VStack>
                <PiDivider orientation={'horizontal'} length={'50%'} my={'.5rem'}/>
                <VStack className={'arbora-scrollbar'} w={'100%'} flex={1} overflowY={'auto'}>
                    <GridDataView grid_data={grid_data} w={'100%'} spacing={7}/>
                </VStack>
                <PiDivider orientation={'horizontal'} length={'50%'}/>
                <VStack w={'100%'} py={'1rem'} align={'center'}>
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
            </VStack>
        </VStack>

    )
}
