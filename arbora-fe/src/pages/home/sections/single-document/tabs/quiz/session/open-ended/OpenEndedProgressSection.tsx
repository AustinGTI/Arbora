import React from "react";
import {Box, BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import GridDataView, {GridCellData} from "../../../../../../../../pillars-ui/components/data_views/GridDataView.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {
    MultipleChoiceQuestion,
    OpenEndedQuestion,
    OpenEndedQuestionAssessment
} from "../../../../../../../../core/services/ai/types.ts";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {FaArrowLeft} from "react-icons/fa";
import PiDivider from "../../../../../../../../pillars-ui/components/layout/PiDivider.tsx";
import {ARBORA_GREEN, ARBORA_RED} from "../../../../../../../../core/constants/styling.ts";
import {gradeToColor} from "./helpers.ts";


interface ProgressSectionProps extends BoxProps {
    active_question_idx: number
    questions: OpenEndedQuestion[] | MultipleChoiceQuestion[]
    answers: Map<string, string | number>
    performance: Map<string, OpenEndedQuestionAssessment> | null
    nextQuestion: () => void
    setActiveQuestionIdx: (question_idx: number) => void
    endSession: () => void
}

export default function OpenEndedProgressSection
({
     questions, answers, performance, setActiveQuestionIdx,
     active_question_idx, endSession, nextQuestion,
     ...box_props
 }: ProgressSectionProps) {

    const [questions_done, total_questions] = React.useMemo(() => {
        let done = 0;
        questions.forEach(({id}) => {
            if (answers.get(id) !== "" && answers.get(id) !== "") {
                done++
            }
        });
        return [done, questions.length]
    }, [questions, answers]);
    const questions_grid_data: GridCellData[] = React.useMemo(() => {
        return questions.map(({id}, index) => {
            let bg_color = 'gray';
            if (performance) {
                bg_color = gradeToColor(performance.get(id)!.grade);
            } else {
                bg_color = ARBORA_GREEN.hard
            }
            return {
                key: id,
                color: bg_color,
                // content: performance ? (
                //     <PiPlainText value={performance.get(id)!.grade}/>
                // ) : undefined,
                content: (
                    <Center position={'relative'} w={'100%'} h={'100%'}>
                        {active_question_idx === index && (
                            <Box position={'absolute'} top={0} left={0} w={'100%'} h={'100%'} rounded={'7px'}
                                 borderColor={'black'} borderWidth={'7px'}/>
                        )}
                        {answers.get(id) !== '' ? (
                            <Box w={'60%'} h={'60%'} rounded={'3px'} bg={'white'}>
                                {performance && (
                                    <PiPlainText value={performance.get(id)?.grade} fontSize={'10px'} fontWeight={700}/>
                                )}
                            </Box>
                        ) : null}
                    </Center>
                ),
                onClick: () => setActiveQuestionIdx(index)
            }
        })
    }, [questions, answers, setActiveQuestionIdx, performance, active_question_idx]);

    const [final_score, max_possible_score, score_color] = React.useMemo(() => {
        const max_possible_score = questions.length * 5;
        let score = 0;
        questions.forEach(({id}) => {
            score += performance?.get(id)!.grade || 0;
        });
        let color = ARBORA_RED.loud;

        switch (score / max_possible_score) {
            case 0.3:
                color = '#FFA500';  // Orange
                break;
            case 0.7:
                color = ARBORA_GREEN.loud;
                break;
        }

        return [score, max_possible_score, color]
    }, [questions, performance]);

    return (
        <VStack
            position={'relative'}
            h={'100%'} justify={'space-between'} px={'1rem'} {...box_props}>
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
                    <GridDataView grid_data={questions_grid_data} w={'100%'}/>
                </VStack>

                <PiDivider orientation={'horizontal'} length={'50%'} my={'.5rem'}/>
                {performance ? (
                    <React.Fragment>
                        <VStack w={'100%'} py={'1rem'} align={'center'}>
                            {[
                                {
                                    key: 'Score',
                                    color: score_color,
                                    content: `${final_score}/${max_possible_score}`
                                },
                                {
                                    key: '%',
                                    color: score_color,
                                    content: `${Math.round((final_score / max_possible_score) * 100)}%`
                                },
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
