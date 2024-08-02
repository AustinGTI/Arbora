export enum QuizType {
    MULTIPLE_CHOICE = "MultipleChoice",
    OPEN_ENDED = "OpenEnded"
}

export interface OpenEndedQuestion {
    id: string
    question: string
}

export interface MultipleChoiceQuestion {
    id: string
    question: string
    choices: string[]
    correct_choice: number
}


export function isMultipleChoiceQuestion(question: OpenEndedQuestion | MultipleChoiceQuestion): question is MultipleChoiceQuestion {
    return (question as MultipleChoiceQuestion).choices !== undefined
}