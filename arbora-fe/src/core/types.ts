export interface BoxDimensions {
    width: number
    height: number
}

export interface Coords2D {
    x: number
    y: number
}

export type RectProps = BoxDimensions & Coords2D