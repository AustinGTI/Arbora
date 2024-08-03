export enum ChatSource {
    USER = 'user',
    ARBY = 'arby'
}

export interface ChatMessage {
    id: string
    unix_timestamp: number
    source: ChatSource
    message: string
    is_loading?: boolean
}