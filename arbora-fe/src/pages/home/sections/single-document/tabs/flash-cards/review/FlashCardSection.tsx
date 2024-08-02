import {BoxProps, Center, Divider, HStack, VStack} from "@chakra-ui/react";
import {FlashCard} from "../types.ts";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import React from "react";

interface ReviewSectionProps extends BoxProps {
    active_card: FlashCard | null
    handleCardReview: (difficulty: number) => void
}


export default function FlashCardSection({active_card, handleCardReview, ...box_props}: ReviewSectionProps) {
    const [answer_visible, setAnswerVisible] = React.useState<boolean>(false)

    React.useEffect(() => {
        setAnswerVisible(false)
    }, [active_card]);


    return (
        <Center overflow={'hidden'} h={'100%'} {...box_props}>
            {active_card && (
                <AnimatePresence mode={'wait'}>
                    <motion.div
                        style={{
                            backgroundColor: 'beige',
                            width: '70%',
                            height: '80%',
                            overflow: 'hidden',
                            borderRadius: '1rem',
                        }}
                        onClick={() => setAnswerVisible(!answer_visible)}
                        key={active_card.id}
                        initial={{y: 300, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -300, opacity: 0}}
                        transition={{duration: 0.3}}>
                        <VStack w={'100%'} h={'100%'}>
                            <VStack w={'100%'} flex={1} justify={'space-around'}>
                                <PiPlainText value={active_card.prompt}/>
                                <Divider orientation={'horizontal'} w={'90%'} borderColor={'black'}/>
                            </VStack>
                            <VStack
                                transition={'height 0.5s'}
                                h={answer_visible ? '50%' : '0%'}
                                opacity={answer_visible ? 1 : 0}>
                                <VStack h={'100%'} justify={'space-around'}>
                                    <PiPlainText value={active_card.answer}/>
                                    <HStack w={'100%'} h={'20%'} justifyContent={'space-around'}>
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