import {Coords2D} from "../types.ts";

export function addVectors(a: Coords2D, b: Coords2D): Coords2D {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

export function subtractVectors(a: Coords2D, b: Coords2D): Coords2D {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

export function multiplyVector(a: Coords2D, scalar: number): Coords2D {
    return {
        x: a.x * scalar,
        y: a.y * scalar
    }
}