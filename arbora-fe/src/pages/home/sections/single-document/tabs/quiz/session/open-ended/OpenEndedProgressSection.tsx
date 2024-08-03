import React from "react";
import {BoxProps, Center, HStack, VStack} from "@chakra-ui/react";
import GridDataView, {GridCellData} from "../../../../../../../../pillars-ui/components/data_views/GridDataView.tsx";
import CircularProgressIndicator
    from "../../../../../../../../pillars-ui/components/data_views/CircularProgressIndicator.tsx";
import PiButton from "../../../../../../../../pillars-ui/components/buttons/PiButton.tsx";
import {
    MultipleChoiceQuestion,
    OpenEndedQuestion,
    OpenEndedQuestionAssessment
} from "../../../../../../../../core/services/ai/types.ts";
import PiPlainText from "../../../../../../../../pillars-ui/components/text/PiPlainText.tsx";


interface ProgressSectionProps extends BoxProps {
    active_question_idx: number
    questions: OpenEndedQuestion[] | MultipleChoiceQuestion[]
    answers: Map<string, string | number>
    performance: Map<string, OpenEndedQuestionAssessment> | null
    setActiveQuestionIdx: (question_idx: number) => void
    endSession: () => void
}

export default function OpenEndedProgressSection
({
     questions, answers, performance, setActiveQuestionIdx,
     active_question_idx, endSession,
     ...box_props
 }: ProgressSectionProps) {

    const questions_done: number = React.useMemo(() => {
        return Array.from(answers.values()).filter(answer => {
            return answer !== "" && answer !== -1
        }).length
    }, [answers]);

    const questions_grid_data: GridCellData[] = React.useMemo(() => {
        return questions.map(({id}, index) => {
            let bg_color = 'gray';
            if (performance) {
                switch (performance.get(id)!.grade) {
                    case 1:
                        bg_color = 'red';
                        break;
                    case 2:
                        bg_color = '#FFA500';  // Orange
                        break;
                    case 3:
                        bg_color = '#90EE90';  // Light Green
                        break;
                    case 4:
                        bg_color = '#32CD32';  // Lime Green
                        break;
                    case 5:
                        bg_color = 'green';
                        break;
                }
            } else {
                if (answers.get(id) !== "" && answers.get(id) !== -1) {
                    bg_color = 'orange'
                } else {
                    bg_color = 'gray'
                }
            }
            return {
                key: id,
                color: bg_color,
                content: performance ? (
                    <PiPlainText value={performance.get(id)!.grade}/>
                ) : undefined,
                onClick: () => setActiveQuestionIdx(index)
            }
        })
    }, [questions, answers, setActiveQuestionIdx, performance]);

    return (
        <VStack h={'100%'} justify={'space-between'} p={'0.5rem'} {...box_props}>
            <GridDataView grid_data={questions_grid_data} w={'100%'} h={'30%'}/>
            <HStack w={'100%'} justify={'center'} py={'2rem'} flex={1}>
                <CircularProgressIndicator percentage={Math.round((questions_done / answers.size) * 100)} size={100}/>
            </HStack>
            <Center w={'100%'} py={'1rem'}>
                <PiButton label={'End Session'} onClick={endSession}/>
            </Center>
        </VStack>

    )
}
