import {addNoise} from "./data-utils.ts";

/**
 * girth per character of text in the note
 */
const TRUNK_GIRTH_CONSTANT: number = 50
const MAX_TRUNK_GIRTH: number = 50
const MIN_TRUNK_GIRTH: number = 5
const BRANCH_GIRTH_CONSTANT: number = 50
const MAX_BRANCH_GIRTH: number = 20
const MIN_BRANCH_GIRTH: number = 5
export const BRANCH_INNER_CURVE: number = 0.7
export const BRANCH_OUTER_CURVE: number = 0.5
export const MIN_BRANCH_TAPER: number = 0.7
/**
 * tree length in px per descendant
 */
const TREE_BASE_HEIGHT: number = 50
const TRUNK_LENGTH_CONSTANT: number = 400
const MAX_TRUNK_LENGTH: number = 200
export const TRUNK_ROUNDNESS: number = 0.6
const TRUNK_LENGTH_NOISE: number = 0.1
const BRANCH_HORIZONTAL_LENGTH_CONSTANT: number = 7000
const MAX_BRANCH_HORIZONTAL_LENGTH: number = 500
const MIN_BRANCH_HORIZONTAL_LENGTH: number = 30
const BRANCH_HORIZONTAL_LENGTH_NOISE: number = 0.3
const BRANCH_VERTICAL_LENGTH_CONSTANT: number = 7000
const MAX_BRANCH_VERTICAL_LENGTH: number = 500
const MIN_BRANCH_VERTICAL_LENGTH: number = 30
const BRANCH_VERTICAL_LENGTH_NOISE: number = 0.2
const MAX_CANOPY_RADIUS: number = 100
const CANOPY_RADIUS_CONSTANT: number = 300
const MIN_CANOPY_RADIUS: number = 20
const CANOPY_RADIUS_NOISE: number = 0.2
const MIN_POSITION_ON_PARENT: number = 0.3
const POSITION_ON_PARENT_NOISE: number = 0.1

export function standardizeContentSize(content_size: number): number {
    return Math.min(content_size / 1000, 1)
}

export function standardizeDescendantCount(no_of_descendants: number): number {
    return Math.min(no_of_descendants / 100, 1)
}

export function calculateTrunkGirth(content_size: number): number {
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_TRUNK_GIRTH, Math.max(MIN_TRUNK_GIRTH, content_size * TRUNK_GIRTH_CONSTANT)), 0.1)
}

export function calculateBranchGirth(content_size: number): number {
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_GIRTH, Math.max(MIN_BRANCH_GIRTH, content_size * BRANCH_GIRTH_CONSTANT)), 0.1)
}

export function calculateTrunkLength(no_of_descendants: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    return addNoise(Math.min(TREE_BASE_HEIGHT + no_of_descendants * TRUNK_LENGTH_CONSTANT, MAX_TRUNK_LENGTH), TRUNK_LENGTH_NOISE)
}

export function calculateBranchHorizontalLength(no_of_descendants: number, content_size: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_HORIZONTAL_LENGTH, Math.max(MIN_BRANCH_HORIZONTAL_LENGTH, content_size * no_of_descendants * BRANCH_HORIZONTAL_LENGTH_CONSTANT)), BRANCH_HORIZONTAL_LENGTH_NOISE)
}

export function calculateBranchVerticalLength(no_of_descendants: number, content_size: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_VERTICAL_LENGTH, Math.max(MIN_BRANCH_VERTICAL_LENGTH, no_of_descendants * content_size * BRANCH_VERTICAL_LENGTH_CONSTANT)), BRANCH_VERTICAL_LENGTH_NOISE)
}

export function calculatePositionOnParent(content_size: number, parent_content_size: number): number {
    return addNoise(Math.min(MIN_POSITION_ON_PARENT + (1 - MIN_POSITION_ON_PARENT) * content_size / parent_content_size, 1), POSITION_ON_PARENT_NOISE)
}

export function calculateCanopyRadius(net_content_size: number): number {
    net_content_size = standardizeContentSize(net_content_size)
    return addNoise(Math.min(MAX_CANOPY_RADIUS, Math.max(MIN_CANOPY_RADIUS, net_content_size ** 1 / 2 * CANOPY_RADIUS_CONSTANT)), CANOPY_RADIUS_NOISE)
}