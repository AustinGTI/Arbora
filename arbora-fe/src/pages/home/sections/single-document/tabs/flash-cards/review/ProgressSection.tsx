import {FlashCard} from "../types.ts";
import {Box, BoxProps, HStack, VStack} from "@chakra-ui/react";
import {FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY} from "./index.tsx";
import React from "react";

interface ProgressSectionProps extends BoxProps {
    flash_cards: FlashCard[]
    card_reviews: Map<string, number[]>
    setActiveCard: (card_id: string) => void
}

const CELL_SIZE = 30
const CELL_BORDER_RADIUS = 5


interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    circleColor?: string;
    progressColor?: string;
    textColor?: string;
}

function CircularProgress
({
     percentage, size = 100, strokeWidth = 8, circleColor = "#e0e0e0",
     progressColor = "#3f51b5", textColor = "#000000"
 }: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - percentage) / 100) * circumference;

    return (
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={circleColor} strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={progressColor} strokeWidth={strokeWidth} strokeDasharray={circumference}
                strokeDashoffset={progress} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
                x="50%" y="50%"
                dominantBaseline="central" textAnchor="middle" fontSize={`${size / 4}px`}
                fill={textColor}>
                {`${Math.round(percentage)}%`}
            </text>
        </svg>
    );
};

export default function ProgressSection
({
     flash_cards, card_reviews, setActiveCard, ...box_props
 }: ProgressSectionProps) {

    const cards_done: number = React.useMemo(() => {
        return Array.from(card_reviews.values()).filter(reviews => reviews.length && reviews.slice(-1)[0] < FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY).length
    }, [card_reviews]);

    return (
        <VStack h={'100%'} justify={'space-between'} p={'0.5rem'} {...box_props}>
            <HStack flexWrap={'wrap'} w={'100%'} py={'1rem'}>
                {flash_cards.map(({id}) => {
                    // if in cards remaining, gray, if in cards failed, red, if in neither, green
                    let bg_color;
                    if (!card_reviews.get(id)?.length) {
                        bg_color = 'gray'
                    } else if (card_reviews.get(id)!.slice(-1)[0] >= FLASH_CARD_REPEAT_THRESHOLD_DIFFICULTY) {
                        bg_color = 'red'
                    } else {
                        bg_color = 'green'
                    }
                    return (
                        <Box
                            key={id}
                            onClick={() => setActiveCard(id)}
                            w={`${CELL_SIZE}px`} h={`${CELL_SIZE}px`}
                            rounded={CELL_BORDER_RADIUS} bg={bg_color}/>
                    )
                })}
            </HStack>
            <HStack w={'100%'} justify={'center'} py={'2rem'} flex={1}>
                <CircularProgress percentage={Math.round((cards_done / card_reviews.size) * 100)} size={100}/>
            </HStack>
        </VStack>

    )
}
