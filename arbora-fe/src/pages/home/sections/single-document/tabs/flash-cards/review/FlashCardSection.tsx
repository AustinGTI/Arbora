import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import React from "react";
import {FlashCard} from "../../../../../../../core/services/ai/types.ts";
import {ARBORA_GREEN} from "../../../../../../../core/constants/styling.ts";
import useCollapse, {CollapseTimer} from "../../../../../../../core/helpers/hooks/useCollapse.tsx";

interface ReviewSectionProps extends BoxProps {
    active_card: FlashCard | null
    handleCardReview: (difficulty: number) => void
}

const TRANSITION_TIME = 400

const CARD_COLLAPSE_TIMERS: CollapseTimer[] = [
    {key: 'display', collapse_delay: TRANSITION_TIME, expand_delay: TRANSITION_TIME},
    {key: 'opacity', collapse_delay: 0, expand_delay: TRANSITION_TIME},
    {key: 'height', collapse_delay: TRANSITION_TIME, expand_delay: 0},
]

export default function FlashCardSection({active_card, handleCardReview, ...box_props}: ReviewSectionProps) {
    const [answer_visible, setAnswerVisible] = React.useState<boolean>(false)

    React.useEffect(() => {
        setAnswerVisible(false)
    }, [active_card]);

    const collapse_state = useCollapse(!answer_visible, CARD_COLLAPSE_TIMERS)

    return (
        <Center overflow={'hidden'} h={'100%'} {...box_props}>
            {active_card && (
                <AnimatePresence mode={'wait'}>
                    <motion.div
                        style={{
                            backgroundColor: ARBORA_GREEN.bg,
                            width: '60%',
                            height: 'calc(100% - 2rem)',
                            marginBottom: '1.5rem',
                            marginTop: '0.5rem',
                            overflow: 'hidden',
                            borderRadius: '1rem',
                        }}
                        onClick={() => setAnswerVisible(!answer_visible)}
                        key={active_card.id}
                        initial={{y: 300, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -300, opacity: 0}}
                        transition={{duration: 0.4}}>
                        <VStack w={'100%'} h={'100%'} overflow={'hidden'}>
                            <VStack className={'arbora-scrollbar'} w={'100%'}
                                    transition={'height 0.4s'}
                                    h={collapse_state.get('height') ? '80%' : '40%'}
                                    justify={'space-around'} overflowY={'scroll'} mt={'1rem'} px={'0.5rem'}>
                                <PiPlainText value={active_card.prompt}/>
                            </VStack>
                            <Box w={'90%'} h={'3px'} rounded={'full'} bg={'black'} m={0} p={0}/>
                            <VStack
                                transition={'height 0.4s, opacity 0.4s'}
                                h={collapse_state.get('height') ? '10%' : '60%'}
                                opacity={collapse_state.get('opacity') ? 0 : 1}>
                                <VStack
                                    display={collapse_state.get('display') ? 'none' : 'block'}
                                    px={'0.5rem'} h={'100%'} overflow={'hidden'} justify={'space-around'}>
                                    <VStack
                                        className={'arbora-scrollbar'} overflowY={'scroll'}
                                        w={'100%'} h={'calc(100% - 40px - 1.5rem)'} justify={'space-around'}>
                                        <PiPlainText value={active_card.answer}/>
                                    </VStack>
                                    <HStack w={'100%'} h={'calc(40px + 1.5rem)'} boxSizing={'border-box'} justifyContent={'space-around'}>
                                        <PiButton label={'Easy'} onClick={() => handleCardReview(1)}/>
                                        <PiButton label={'Medium'} onClick={() => handleCardReview(3)}/>
                                        <PiButton label={'Hard'} onClick={() => handleCardReview(5)}/>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </VStack>
                    </motion.div>
                </AnimatePresence>
            )}
        </Center>
    )
}