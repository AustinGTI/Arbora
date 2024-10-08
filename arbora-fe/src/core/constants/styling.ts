interface ColorPalette {
    fg: string
    bg: string

    soft: string
    hard: string
    mid: string

    loud: string
}

export const ARBORA_GREEN: ColorPalette = {
    soft: '#F0FFF0',
    mid: '#A8E4A0',
    hard: '#5E8248',
    fg: '#BFE3BF',
    bg: '#F0FFF0',
    loud: '#A7F432'
}

export const ARBORA_RED: ColorPalette = {
    loud: '#FF033E',
    soft: '#FFD6E0',
    mid: '#FF7A9A',
    hard: '#FF033E',
    fg: '#FF7A9A',
    bg: '#FFD6E0'
}
