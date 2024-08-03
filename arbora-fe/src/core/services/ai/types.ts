export interface FlashCard {
    id: string
    prompt: string
    answer: string
}

// region QUESTION TYPES AND HELPERS
// ? ........................

export interface OpenEndedQuestion {
    id: string
    question: string
}

export interface OpenEndedQuestionAssessment {
    id: string
    // 1 - 5
    grade: number
    comment: string
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

// ? ........................
// endregion ........................


export interface ChatResponse {
    message: string
    is_last: boolean
}