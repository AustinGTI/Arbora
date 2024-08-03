import React from 'react';
import {BoxProps, Center, HStack, SimpleGrid, VStack} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonVariant} from "../../../../../../../pillars-ui/components/buttons/types.ts";
import {MultipleChoiceQuestion} from "../../../../../../../core/services/ai/types.ts";

interface MultipleChoiceQuestionSectionProps extends BoxProps {
    review_mode: boolean
    active_question: MultipleChoiceQuestion
    is_last_question: boolean
    setAnswer: (answer: number) => void
}

export default function MultipleChoiceQuestionSection({
                                                          review_mode,
                                                          active_question,
                                                          setAnswer,
                                                          is_last_question,
                                                          ...box_props
                                                      }: MultipleChoiceQuestionSectionProps) {
    const [selected_choice, setSelectedChoice] = React.useState<number | null>(null)

    React.useEffect(() => {
        setSelectedChoice(null)
    }, [active_question]);

    return (
        <Center overflow={'hidden'} h={'100%'} {...box_props}>
            {active_question && (
                <AnimatePresence mode={'wait'}>
                    <motion.div
                        style={{
                            backgroundColor: 'beige',
                            width: '90%',
                            height: '70%',
                            overflow: 'hidden',
                            borderRadius: '1rem',
                        }}
                        key={active_question.id}
                        initial={{y: 300, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -300, opacity: 0}}
                        transition={{duration: 0.3}}>
                        <VStack w={'100%'} h={'100%'} justify={'center'} spacing={'1rem'}>
                            <PiPlainText value={active_question.question} align={'center'} fontSize={'22px'}
                                         fontWeight={500}/>
                            <SimpleGrid columns={2} spacing={4}>
                                {active_question.choices.map((choice, index) => {
                                    // highlight the correct choice if in review mode
                                    return (
                                        <PiButton
                                            key={index}
                                            label={choice}
                                            variant={PiButtonVariant.GHOST}
                                            onClick={() => setSelectedChoice(index)}
                                            bg={review_mode && active_question.correct_choice === index ? '#afa' : 'transparent'}
                                            color={selected_choice === index ? 'blue' : 'black'}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                            <HStack w={'100%'} justifyContent={'center'}>
                                <PiButton
                                    label={is_last_question ? 'Finish' : 'Next'}
                                    isDisabled={selected_choice === null}
                                    onClick={() => {
                                        if (selected_choice === null) {
                                            return
                                        }
                                        setAnswer(selected_choice)
                                    }}/>
                            </HStack>
                        </VStack>
                    </motion.div>
                </AnimatePresence>
            )}
        </Center>

    )
}