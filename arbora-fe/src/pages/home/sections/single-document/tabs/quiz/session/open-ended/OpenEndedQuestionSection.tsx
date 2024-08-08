import {BoxProps, Center, HStack, Textarea, VStack} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import React from "react";
import {OpenEndedQuestion, OpenEndedQuestionAssessment} from "../../../../../../../../core/services/ai/types.ts";
import {ARBORA_GREEN} from "../../../../../../../../core/constants/styling.ts";
import PiDivider from "../../../../../../../../pillars-ui/components/layout/PiDivider.tsx";
import {gradeToColor} from "./helpers.ts";
import chroma from "chroma-js"

interface OpenEndedQuestionSectionProps extends BoxProps {
    active_question_idx: number
    review_mode: boolean
    performance: Map<string, OpenEndedQuestionAssessment> | null
    answers: Map<string, string>
    active_question?: OpenEndedQuestion
    is_last_question: boolean
    setAnswer: (answer: string) => void
}

export default function OpenEndedQuestionSection
({
     active_question_idx, review_mode, performance, answers,
     active_question, setAnswer, is_last_question, ...box_props
 }: OpenEndedQuestionSectionProps) {
    const [text_input, setTextInput] = React.useState<string>('')

    React.useEffect(() => {
        if (active_question && answers.get(active_question.id)) {
            setTextInput(answers.get(active_question.id) || '')
        } else {
            setTextInput('')
        }
    }, [active_question]);

    React.useEffect(() => {
        if (text_input === '') {
            return
        }
        setAnswer(text_input)
    }, [text_input]);

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
                        <VStack
                            position={'relative'} w={'100%'} h={'100%'} justify={'center'} spacing={'0px'}>
                            <Center position={'absolute'} top={0} left={0} p={'1rem'}>
                                <PiPlainText value={`${active_question_idx + 1}.`} fontSize={'24px'}
                                             fontWeight={700}/>
                            </Center>
                            <VStack
                                className={'arbora-scrollbar'}
                                h={review_mode ? '50%' : '60%'} spacing={0}
                                justify={'space-around'} px={'1.5rem'} mt={'1rem'}>
                                <PiPlainText
                                    value={active_question.question} align={'center'}
                                    fontSize={review_mode ? '16px' : '18px'}
                                    fontWeight={500}/>
                                {performance && (
                                    <HStack w={'100%'} p={'.5rem'} rounded={'10px'}
                                            bg={chroma(gradeToColor(performance.get(active_question.id)!.grade)).alpha(0.2).css()}>
                                        <PiPlainText w={'85%'} value={`${answers.get(active_question.id)}`}/>
                                        <HStack w={'15%'} justify={'flex-end'}>
                                            <PiPlainText value={`${performance.get(active_question.id)!.grade}/5`}
                                                         fontSize={'30px'}/>
                                        </HStack>
                                    </HStack>
                                )}
                            </VStack>
                            {review_mode && (
                                <PiDivider orientation={'horizontal'} length={'80%'} my={'5px'} flexShrink={0}/>
                            )}
                            <VStack w={'100%'}
                                    h={review_mode ? '50%' : '40%'}
                                    flex={'1 1 auto'}
                                    px={'1rem'} justify={'center'}>
                                {(!review_mode || !performance) ? (
                                    <Textarea
                                        width={'100%'}
                                        bg={'white'}
                                        border={"1px"}
                                        fontSize={"sm"}
                                        value={text_input}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder={'Type your answer here'}
                                        rows={5}/>
                                ) : (
                                    <VStack w={'100%'} h={'100%'}
                                            className={'arbora-scrollbar'}
                                            overflowY={'auto'} overflowX={'hidden'} my={'0.5rem'}>
                                        <PiPlainText value={performance.get(active_question.id)?.comment}/>
                                    </VStack>
                                )}
                            </VStack>
                        </VStack>
                    </motion.div>
                </AnimatePresence>

            )}
        </Center>
    )
}