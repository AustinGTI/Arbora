import {addSeededNoise} from "./data-utils.ts";

/**
 * girth per character of text in the note
 */
const TRUNK_GIRTH_CONSTANT: number = 0.4
const MAX_TRUNK_GIRTH: number = 50
const MIN_TRUNK_GIRTH: number = 10

const BRANCH_GIRTH_CONSTANT: number = 0.05
const MAX_BRANCH_GIRTH: number = 20
const MIN_BRANCH_GIRTH: number = 3

export const BRANCH_INNER_CURVE: number = 0.7
export const BRANCH_OUTER_CURVE: number = 0.5
export const MIN_BRANCH_TAPER: number = 0.7
/**
 * tree length in px per descendant
 */
const TREE_BASE_HEIGHT: number = 50
const TRUNK_LENGTH_CONSTANT: number = 1.2
const MAX_TRUNK_LENGTH: number = 300
export const TRUNK_ROUNDNESS: number = 0.6
const TRUNK_LENGTH_NOISE: number = 0.1


const MAX_CANOPY_RADIUS: number = 100
const CANOPY_RADIUS_CONSTANT: number = 0.27
const MIN_CANOPY_RADIUS: number = 20
const CANOPY_RADIUS_NOISE: number = 0.2

const NOISE_FACTOR: number = 0.05

function clipValue(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

export function calculateTrunkGirth(tree_branch_id: string, content_size: number): number {
    return addSeededNoise(clipValue(content_size * TRUNK_GIRTH_CONSTANT, MIN_TRUNK_GIRTH, MAX_TRUNK_GIRTH), NOISE_FACTOR, tree_branch_id)
}

export function calculateBranchGirth(tree_branch_id: string,content_size: number): number {
    return addSeededNoise(clipValue(content_size * BRANCH_GIRTH_CONSTANT, MIN_BRANCH_GIRTH, MAX_BRANCH_GIRTH), NOISE_FACTOR, tree_branch_id)
}

export function calculateTrunkLength(tree_branch_id: string,no_of_descendants: number): number {
    return addSeededNoise(clipValue(TREE_BASE_HEIGHT + no_of_descendants * TRUNK_LENGTH_CONSTANT, 0, MAX_TRUNK_LENGTH), TRUNK_LENGTH_NOISE, tree_branch_id)
}

export function calculateCanopyRadius(tree_branch_id: string,net_content_size: number): number {
    return addSeededNoise(clipValue(net_content_size ** 1 / 2 * CANOPY_RADIUS_CONSTANT, MIN_CANOPY_RADIUS, MAX_CANOPY_RADIUS), CANOPY_RADIUS_NOISE, tree_branch_id)
}