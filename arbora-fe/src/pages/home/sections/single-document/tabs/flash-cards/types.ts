export interface FlashCard {
    id: string
    prompt: string
    answer: string
}

export interface FlashCardReviewRecord {
    id: string
    // 1 to 5, 1 is easiest, 5 is hardest
    difficulty: number
}