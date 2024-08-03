import {BoxProps, Center, Divider, HStack, VStack} from "@chakra-ui/react";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiTextAreaInput from "../../../../../../../../pillars-ui/components/forms/inputs/text/PiTextAreaInput.tsx";
import React from "react";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {OpenEndedQuestion, OpenEndedQuestionAssessment} from "../../../../../../../../core/services/ai/types.ts";

interface OpenEndedQuestionSectionProps extends BoxProps {
    review_mode: boolean
    performance: Map<string, OpenEndedQuestionAssessment> | null
    answers: Map<string, string>
    active_question?: OpenEndedQuestion
    is_last_question: boolean
    setAnswer: (answer: string) => void
}

export default function OpenEndedQuestionSection
({
     review_mode, performance, answers,
     active_question, setAnswer, is_last_question, ...box_props
 }: OpenEndedQuestionSectionProps) {
    const [text_input, setTextInput] = React.useState<string>('')

    React.useEffect(() => {
        setTextInput('')
    }, [active_question]);

    return (
        <Center overflow={'hidden'} h={'100%'} {...box_props}>
            {active_question && (
                <AnimatePresence mode={'wait'}>
                    <motion.div
                        style={{
                            backgroundColor: 'beige',
                            width: '100%',
                            height: '90%',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            overflow: 'hidden',
                            borderRadius: '1rem',
                        }}
                        key={active_question.id}
                        initial={{y: 300, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -300, opacity: 0}}
                        transition={{duration: 0.3}}>
                        <VStack w={'100%'} h={'100%'} py={'1rem'} justify={'center'} spacing={'1rem'}>
                            <PiPlainText value={active_question.question} align={'center'} fontSize={'18px'}
                                         fontWeight={500}/>
                            {(!review_mode || !performance) ? (
                                <PiTextAreaInput
                                    width={'90%'}
                                    input_type={'generic'}
                                    onInputChange={(value) => setTextInput(value)}
                                    placeholder={'Type your answer here'}
                                    rows={5}/>
                            ) : (
                                <VStack w={'90%'}>
                                    <VStack w={'100%'} py={'.5rem'}>
                                        <PiPlainText value={`Your Answer : ${answers.get(active_question.id)}`}/>
                                        <HStack w={'100%'} justify={'flex-end'}>
                                            <PiPlainText value={`${performance.get(active_question.id)!.grade}/5`}
                                                         fontSize={'30px'}/>
                                        </HStack>
                                    </VStack>
                                    <Divider/>
                                    <PiPlainText value={performance.get(active_question.id)?.comment}/>
                                </VStack>
                            )}
                            <HStack w={'100%'} justifyContent={'center'}>
                                <PiButton
                                    label={is_last_question ? 'Finish' : 'Next'}
                                    isDisabled={text_input === ''}
                                    onClick={() => {
                                        setAnswer(text_input)
                                    }}/>
                            </HStack>
                        </VStack>
                    </motion.div>
                </AnimatePresence>

            )}
        </Center>
    )
}