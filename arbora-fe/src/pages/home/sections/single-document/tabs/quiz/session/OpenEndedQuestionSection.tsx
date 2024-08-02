import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import {OpenEndedQuestion} from "../types.ts";
import {motion, AnimatePresence} from "framer-motion";
import PiPlainText from "../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiTextAreaInput from "../../../../../../../pillars-ui/components/forms/inputs/text/PiTextAreaInput.tsx";
import React from "react";
import PiButton from "../../../../../../../pillars-ui/components/buttons/PiButton.tsx";

interface OpenEndedQuestionSectionProps extends BoxProps {
    review_mode: boolean
    active_question?: OpenEndedQuestion
    is_last_question: boolean
    setAnswer: (answer: string) => void
}

export default function OpenEndedQuestionSection
({
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
                        <VStack w={'100%'} h={'100%'} py={'1rem'} justify={'center'} spacing={'1rem'}>
                            <PiPlainText value={active_question.question} align={'center'} fontSize={'22px'}
                                         fontWeight={500}/>
                            <PiTextAreaInput
                                width={'90%'}
                                input_type={'generic'}
                                onInputChange={(value) => setTextInput(value)}
                                placeholder={'Type your answer here'}
                                rows={5}/>
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