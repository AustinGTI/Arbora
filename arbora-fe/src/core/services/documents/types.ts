export interface Document {
    id: string
    folder_id?: string
    creator_id: string
    title: string
    content: string
    notes: {[key: string]: Note}
}

export interface Note {
    created_at: string
    title: string
    content: string
    level: number
}