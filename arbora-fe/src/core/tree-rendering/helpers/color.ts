import {calculateInterpolatedColorWithNoise} from "../../helpers/colors.ts";

const NOISE_FACTOR = 0.1; // Adjust this value to control the strength of the noise

const RECALL_PROBABILITY_COLOR_RANGE: Array<[string,number]> = [
    ["#E67E22", 0],    // Fall Orange
    ["#9C5700", 0.25], // Rusty Brown
    ["#F4D03F", 0.5],  // Pale Yellow
    ["#A3E4D7", 0.75], // Light Green
    ["#27AE60", 1]     // Spring Green
]


export function recallProbabilityToColor(recall_probability: number,noise_seed: string): string {
    return calculateInterpolatedColorWithNoise(recall_probability, RECALL_PROBABILITY_COLOR_RANGE, noise_seed, NOISE_FACTOR)
}