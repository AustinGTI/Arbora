export interface Folder {
    id: string
    name: string
    created_at: string
}

export interface Document {
    id: string
    folder_id?: string
    creator_id: string
    title: string
    content: string
    notes: { [key: string]: Note }
}

export interface Note {
    created_at: string
    title: string
    content: string
    level: number
    children: string[]
    recall_probability: number
}

export enum NoteReviewType {
    FLASH_CARDS = "flash_cards",
    MULTIPLE_CHOICE_QUESTIONS = "multiple_choice_questions",
    OPEN_ENDED_QUESTIONS = "open_ended_questions",
    CHAT = "chat"
}