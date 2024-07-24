interface MentionPackOption {
    id: string
    display: string
}

export interface MentionPack {
    trigger: string
    options: MentionPackOption[]
    markup?: string
}

export interface TextOption {
    value: string
    display: string
}