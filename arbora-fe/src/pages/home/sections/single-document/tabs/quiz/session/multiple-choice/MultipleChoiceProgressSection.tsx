import React from "react";
import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import GridDataView, {GridCellData} from "../../../../../../../../pillars-ui/components/data_views/GridDataView.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {MultipleChoiceQuestion, OpenEndedQuestion} from "../../../../../../../../core/services/ai/types.ts";
import {FaArrowLeft} from "react-icons/fa";
import {ARBORA_GREEN} from "../../../../../../../../core/constants/styling.ts";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import PiDivider from "../../../../../../../../pillars-ui/components/layout/PiDivider.tsx";
import {StandardConsole} from "../../../../../../../../core/helpers/logging.ts";


interface MultipleChoiceProgressSectionProps extends BoxProps {
    review_mode: boolean
    active_question_idx: number
    questions: OpenEndedQuestion[] | MultipleChoiceQuestion[]
    answers: Map<string, string | number>
    performance: Map<string, boolean> | null
    setActiveQuestionIdx: (question_idx: number) => void
    nextQuestion: () => void
    endSession: () => void
}

export default function MultipleChoiceProgressSection
({
     questions, answers, performance, setActiveQuestionIdx,
     active_question_idx, endSession, nextQuestion,
     ...box_props
 }: MultipleChoiceProgressSectionProps) {
    StandardConsole.log('answers are ',answers)
    const questions_grid_data: GridCellData[] = React.useMemo(() => {
        return questions.map(({id}, index) => {
            let bg_color = 'gray';
            if (performance) {
                if (performance.get(id) === true) {
                    bg_color = ARBORA_GREEN.loud
                } else if (performance.get(id) === false) {
                    bg_color = '#FF033E'
                }
            } else {
                bg_color = ARBORA_GREEN.hard
            }
            return {
                key: id,
                color: bg_color,
                onClick: () => setActiveQuestionIdx(index),
                content: (
                    <Center position={'relative'} w={'100%'} h={'100%'}>
                        {active_question_idx === index && (
                            <Box position={'absolute'} top={0} left={0} w={'100%'} h={'100%'} rounded={'7px'}
                                 borderColor={'black'} borderWidth={'7px'}/>
                        )}
                        {answers.get(id) !== -1 ? (
                            <Box w={'60%'} h={'60%'} rounded={'3px'} bg={'white'}/>
                        ) : null}
                    </Center>
                )
            }
        })
    }, [questions, answers, setActiveQuestionIdx, performance, active_question_idx]);

    const [questions_done, total_questions] = React.useMemo(() => {
        let done = 0;
        questions.forEach(({id}) => {
            if (answers.get(id) !== "" && answers.get(id) !== -1) {
                done++
            }
        });
        return [done, questions.length]
    }, [questions, answers]);

    const [correctly_answered, wrongly_answered] = React.useMemo(() => {
        if (!performance) return [0, 0]
        let correct = 0;
        let wrong = 0;
        performance.forEach((is_correct) => {
            if (is_correct) {
                correct++
            } else {
                wrong++
            }
        });
        return [correct, wrong]
    }, [performance]);

    return (
        <VStack
            position={'relative'}
            h={'100%'} justify={'space-between'} px={'1rem'}
            {...box_props}>
            <Center position={'absolute'} p={'1rem'} top={0} left={0}>
                <PiButton
                    onClick={endSession}
                    with_confirmation={!performance}
                    icon_props={{fontSize: '20px'}}
                    confirmation_message={'Are you sure you want to leave before answering all the questions?'}
                    icon={FaArrowLeft}/>
            </Center>
            <VStack
                p={'0.5rem'}
                w={'100%'} h={'calc(100% - 2rem)'} mb={'1.5rem'} mt={'0.5rem'}
                rounded={'10px'} bg={ARBORA_GREEN.bg}>
                <VStack w={'100%'} pt={'1rem'} align={'center'} spacing={0}>
                    <PiPlainText value={`${questions_done}/${total_questions}`} fontSize={'22px'} fontWeight={600}/>
                    <PiPlainText value={'Answered'} fontWeight={700}/>
                </VStack>
                <PiDivider orientation={'horizontal'} length={'50%'} my={'.5rem'}/>

                <VStack className={'arbora-scrollbar'} w={'100%'} flex={1} overflowY={'auto'}>
                    <GridDataView grid_data={questions_grid_data} w={'100%'} spacing={7}/>
                </VStack>
                {performance ? (
                    <React.Fragment>
                        <PiDivider orientation={'horizontal'} length={'50%'} my={'.5rem'}/>
                        <VStack w={'100%'} py={'1rem'} align={'center'}>
                            {[
                                {key: 'Correct', color: ARBORA_GREEN.loud, content: correctly_answered},
                                {key: 'Wrong', color: 'red', content: wrongly_answered},
                            ].map(({key, color, content}) => (
                                <HStack w={'100%'} key={key} justify={'center'}>
                                    <PiPlainText value={key} fontWeight={700} fontSize={'20px'}
                                                 textDecoration={'underline'} textDecorationColor={color}/>
                                    <PiPlainText value={' : ' + content} fontWeight={600} fontSize={'20px'}/>
                                </HStack>
                            ))}
                        </VStack>
                    </React.Fragment>
                ) : (
                    <HStack h={'15%'} w={'100%'} justifyContent={'center'} align={'flex-start'}>
                        <PiButton
                            label={
                                // finish if all questions are answered
                                questions_done === total_questions ? 'Finish' : 'Next'}
                            onClick={() => {
                                nextQuestion()
                            }}/>
                    </HStack>
                )}
            </VStack>
        </VStack>

    )
}
