import React from 'react';
import {BoxProps, Center, HStack, SimpleGrid, VStack} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonVariant} from "../../../../../../../../pillars-ui/components/buttons/types.ts";
import {MultipleChoiceQuestion} from "../../../../../../../../core/services/ai/types.ts";
import {ARBORA_GREEN} from "../../../../../../../../core/constants/styling.ts";
import PiDivider from "../../../../../../../../pillars-ui/components/layout/PiDivider.tsx";
import {StandardConsole} from "../../../../../../../../core/helpers/logging.ts";

interface MultipleChoiceQuestionSectionProps extends BoxProps {
    active_question_index: number
    review_mode: boolean
    active_question: MultipleChoiceQuestion
    answer: number
    setAnswer: (answer: number) => void
}

export default function MultipleChoiceQuestionSection({
                                                          active_question_index,
                                                          review_mode,
                                                          active_question,
                                                          answer, setAnswer,
                                                          ...box_props
                                                      }: MultipleChoiceQuestionSectionProps) {
    const [selected_choice, setSelectedChoice] = React.useState<number>(-1)

    React.useEffect(() => {
        setSelectedChoice(-1)
    }, [active_question]);

    React.useEffect(() => {
        if (selected_choice === -1) {
            return
        }
        setAnswer(selected_choice)
    }, [selected_choice]);

    StandardConsole.log('current question is ', active_question, 'of index', active_question_index, 'and answer given is ', answer)

    return (
        <Center overflow={'hidden'} h={'100%'} {...box_props}>
            {active_question && (
                <AnimatePresence mode={'wait'}>
                    <motion.div
                        style={{
                            backgroundColor: ARBORA_GREEN.bg,
                            width: '90%',
                            height: 'calc(100% - 2rem)',
                            marginBottom: '1.5rem',
                            marginTop: '0.5rem',
                            overflow: 'hidden',
                            borderRadius: '1rem',
                        }}
                        key={active_question.id}
                        initial={{y: 300, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -300, opacity: 0}}
                        transition={{duration: 0.3}}>
                        <VStack position={'relative'} w={'100%'} h={'100%'} justify={'center'} spacing={'0px'}>
                            <Center position={'absolute'} top={0} left={0} p={'1rem'}>
                                <PiPlainText value={`${active_question_index + 1}.`} fontSize={'24px'}
                                             fontWeight={700}/>
                            </Center>
                            <VStack
                                className={'arbora-scrollbar'}
                                overflowY={'scroll'}
                                h={'50%'} justify={'space-around'} px={'1rem'}>
                                <PiPlainText value={active_question.question} align={'center'} fontSize={'20px'}
                                             fontWeight={500}/>
                            </VStack>
                            <PiDivider orientation={'horizontal'} length={'80%'}/>
                            <VStack
                                className={'arbora-scrollbar'}
                                overflowY={'scroll'} overflowX={'hidden'}
                                h={'50%'} justify={'flex-start'} p={'1rem'} pb={0}>
                                <SimpleGrid
                                    h={'50%'} w={'100%'} columns={2} spacing={1}>
                                    {active_question.choices.map((choice, index) => {
                                        let choice_highlight = 'transparent'
                                        if (review_mode) {
                                            if (active_question.correct_choice === index) {
                                                choice_highlight = '#afa'
                                            } else if (index === answer) {
                                                choice_highlight = '#fba'
                                            }
                                        }
                                        // highlight the correct choice if in review mode
                                        return (
                                            <PiButton
                                                key={index}
                                                variant={PiButtonVariant.GHOST}
                                                onClick={() => {
                                                    if (review_mode) {
                                                        return
                                                    }
                                                    setSelectedChoice(index);
                                                }}
                                                with_tooltip={choice.length > 50}
                                                tooltip_label={choice} tooltip_placement={'left'}
                                                bg={choice_highlight} rounded={'7px'} py={'0.5rem'}
                                                color={selected_choice === index ? 'blue' : 'black'}>
                                                <HStack w={'100%'} h={'3.5rem'}>
                                                    <PiPlainText value={String.fromCharCode(65 + index) + '.'}
                                                                 fontSize={'15px'} fontWeight={700}/>
                                                    <PiPlainText value={
                                                        choice.length > 50 ? choice.slice(0, 50) + '...' : choice
                                                    } align={'left'} fontSize={'13px'} fontWeight={500}
                                                                 overflowWrap={'break-word'} whiteSpace={'normal'}/>
                                                </HStack>
                                            </PiButton>
                                        );
                                    })}
                                </SimpleGrid>
                            </VStack>
                        </VStack>
                    </motion.div>
                </AnimatePresence>
            )}
        </Center>

    )
}