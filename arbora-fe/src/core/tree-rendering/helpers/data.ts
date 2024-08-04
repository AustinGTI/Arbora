import {BranchDirection, BranchType, RawBranchData, TreeBranchData} from "../types.ts";
import {Document} from "../../services/documents/types.ts";
import {BoxDimensions} from "../../types.ts";
import {StandardConsole} from "../../helpers/logging.ts";

/**
 * generate the intermediate branch data map between the final branch data and the document and note information
 * in the global context
 * @param document
 */
export function generateRawBranchDataMap(document: Document): Map<string, RawBranchData> {
    const map = new Map<string, RawBranchData>()

    const root_notes: string[] = []

    Object.keys(document.notes)
        // sort by length to ensure a child note is not created before its parent
        .sort((a, b) => {
            return a.length - b.length
        })
        .forEach(note_id => {
            const note_content_size = document.notes[note_id].content.length
            map.set(note_id, {
                id: note_id,
                net_content_size: note_content_size,
                gross_content_size: 0,
                no_of_descendants: 0,
                children: []
            })

            if (!note_id.includes('.')) {
                root_notes.push(note_id)
                return
            }

            const parent_branch = map.get(note_id.split('.').slice(0, -1).join('.'))

            if (!parent_branch) {
                throw Error('child rendering before parent')
            }

            map.set(parent_branch.id, {
                ...parent_branch,
                children: [...parent_branch.children, note_id]
            })
        })


    function updateContentSizeAndDescendantCount(note_id: string): [number, number] {
        const branch_data = map.get(note_id)!;
        let gross_content_size: number = branch_data.net_content_size
        let no_of_descendants: number = branch_data.children.length


        branch_data.children.forEach(child_note_id => {
            const [child_no_of_descendants, child_gross_content_size] = updateContentSizeAndDescendantCount(child_note_id)
            no_of_descendants += child_no_of_descendants
            gross_content_size += child_gross_content_size
        })

        map.set(note_id, {
            ...branch_data,
            gross_content_size,
            no_of_descendants
        })
        return [no_of_descendants, gross_content_size]
    }

    root_notes.forEach(note_id => {
        updateContentSizeAndDescendantCount(note_id)
    })

    return map
}

/**
 * girth per character of text in the note
 */
const TRUNK_GIRTH_CONSTANT: number = 100
const MAX_TRUNK_GIRTH: number = 50
const MIN_TRUNK_GIRTH: number = 10

const BRANCH_GIRTH_CONSTANT: number = 50
const MAX_BRANCH_GIRTH: number = 20
const MIN_BRANCH_GIRTH: number = 5

const BRANCH_INNER_CURVE: number = 0.7
const BRANCH_OUTER_CURVE: number = 0.5
const MIN_BRANCH_TAPER: number = 0.7

/**
 * tree length in px per descendant
 */
const TREE_BASE_HEIGHT: number = 50
const TRUNK_LENGTH_CONSTANT: number = 400
const MAX_TRUNK_LENGTH: number = 200
const TRUNK_ROUNDNESS: number = 0.6
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
const MIN_CANOPY_RADIUS: number = 10
const CANOPY_RADIUS_NOISE: number = 0.2

const MIN_POSITION_ON_PARENT: number = 0.3
const POSITION_ON_PARENT_NOISE: number = 0.1

function standardizeContentSize(content_size: number): number {
    return Math.min(content_size / 1000, 1)
}

function standardizeDescendantCount(no_of_descendants: number): number {
    return Math.min(no_of_descendants / 100, 1)
}

function addNoise(value: number, noise: number): number {
    return value + value * 2 * noise * (Math.random() - 0.5)
}

function calculateTrunkGirth(content_size: number): number {
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_TRUNK_GIRTH, Math.max(MIN_TRUNK_GIRTH, content_size * TRUNK_GIRTH_CONSTANT)), 0.1)
}

function calculateBranchGirth(content_size: number): number {
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_GIRTH, Math.max(MIN_BRANCH_GIRTH, content_size * BRANCH_GIRTH_CONSTANT)), 0.1)
}

function calculateTrunkLength(no_of_descendants: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    return addNoise(Math.min(TREE_BASE_HEIGHT + no_of_descendants * TRUNK_LENGTH_CONSTANT, MAX_TRUNK_LENGTH), TRUNK_LENGTH_NOISE)
}

function calculateBranchHorizontalLength(no_of_descendants: number, content_size: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_HORIZONTAL_LENGTH, Math.max(MIN_BRANCH_HORIZONTAL_LENGTH, content_size * no_of_descendants * BRANCH_HORIZONTAL_LENGTH_CONSTANT)), BRANCH_HORIZONTAL_LENGTH_NOISE)
}

function calculateBranchVerticalLength(no_of_descendants: number, content_size: number): number {
    no_of_descendants = standardizeDescendantCount(no_of_descendants)
    content_size = standardizeContentSize(content_size)
    return addNoise(Math.min(MAX_BRANCH_VERTICAL_LENGTH, Math.max(MIN_BRANCH_VERTICAL_LENGTH, no_of_descendants * content_size * BRANCH_VERTICAL_LENGTH_CONSTANT)), BRANCH_VERTICAL_LENGTH_NOISE)
}

function calculatePositionOnParent(content_size: number, parent_content_size: number): number {
    return addNoise(Math.min(MIN_POSITION_ON_PARENT + (1 - MIN_POSITION_ON_PARENT) * content_size / parent_content_size, 1), POSITION_ON_PARENT_NOISE)
}

function calculateCanopyRadius(net_content_size: number): number {
    net_content_size = standardizeContentSize(net_content_size)
    return addNoise(Math.min(MAX_CANOPY_RADIUS, Math.max(MIN_CANOPY_RADIUS, net_content_size ** 1 / 2 * CANOPY_RADIUS_CONSTANT)), CANOPY_RADIUS_NOISE)
}


function getMaxBranchVolume(root_branch_id: string, raw_branch_data_map: Map<string, RawBranchData>): number {
    // recursively get the max branch volume
    const root_branch_data = raw_branch_data_map.get(root_branch_id)!
    const volume = root_branch_data.gross_content_size * root_branch_data.no_of_descendants
    let max_child_volume = 0
    root_branch_data.children.forEach(child_id => {
        max_child_volume = Math.max(max_child_volume, getMaxBranchVolume(child_id, raw_branch_data_map))
    })
    return volume + max_child_volume
}

function treeBranchDataValidation(tree_branch_data: TreeBranchData): TreeBranchData {
    // this function uses a series of rules to validate the tree branch data and correct mistakes

    // 1. in a normal branch type, the horizontal length should never be greater than the vertical length, if so reduce it to the vertical length
    if (tree_branch_data.branch_config.branch_type === BranchType.NORMAL) {
        if (tree_branch_data.branch_config.h_length > tree_branch_data.branch_config.v_length) {
            tree_branch_data.branch_config.h_length = tree_branch_data.branch_config.v_length
        }
    }

    return tree_branch_data
}

export function generateTreeBranchData(raw_branch_data_map: Map<string, RawBranchData>): TreeBranchData[] {

    function rawBranchToTreeBranch(raw_branch_id: string, direction: BranchDirection, position_on_parent: number, parent_completion_end: number, max_branch_volume: number, is_root: boolean = true): TreeBranchData {
        let weight_balance = 0

        const raw_branch_data = raw_branch_data_map.get(raw_branch_id)!
        const completion_end = parent_completion_end + (raw_branch_data.gross_content_size * raw_branch_data.no_of_descendants) / max_branch_volume

        const children = raw_branch_data.children.map(raw_branch_child_id => {
            let direction: BranchDirection;
            // if the weight balance is 0, pick randomly between left and right
            if (weight_balance === 0) {
                direction = Math.random() > 0.5 ? 'left' : 'right'
            } else {
                // if the weight balance is positive, pick left
                direction = weight_balance > 0 ? 'left' : 'right'
            }
            // add the child weight to the balance if the direction is right, subtract if left
            weight_balance += direction === 'right' ? raw_branch_data_map.get(raw_branch_child_id)!.gross_content_size : -raw_branch_data_map.get(raw_branch_child_id)!.gross_content_size

            return rawBranchToTreeBranch(
                raw_branch_child_id,
                // position on parent is the child gross content size divided by the parent gross content size
                direction,
                calculatePositionOnParent(raw_branch_data_map.get(raw_branch_child_id)!.gross_content_size, raw_branch_data.gross_content_size),
                completion_end, max_branch_volume,
                false);
        })

        // taper is the (gross_content - net_content)/gross_content
        const taper = MIN_BRANCH_TAPER + (1 - MIN_BRANCH_TAPER) * (raw_branch_data.gross_content_size - raw_branch_data.net_content_size) / raw_branch_data.gross_content_size

        return treeBranchDataValidation({
            id: raw_branch_id,
            branch_direction: direction,
            branch_config: is_root ? {
                branch_type: BranchType.TRUNK,
                girth: calculateTrunkGirth(raw_branch_data.gross_content_size),
                length: calculateTrunkLength(raw_branch_data.no_of_descendants),
                // taper is the children gross content size divided by the parent gross content size
                taper,
                roundness: TRUNK_ROUNDNESS
            } : {
                branch_type: BranchType.NORMAL,
                girth: calculateBranchGirth(raw_branch_data.gross_content_size),
                h_length: calculateBranchHorizontalLength(raw_branch_data.no_of_descendants, raw_branch_data.net_content_size),
                v_length: calculateBranchVerticalLength(raw_branch_data.no_of_descendants, raw_branch_data.net_content_size),
                taper,
                inner_curve: BRANCH_INNER_CURVE,
                outer_curve: BRANCH_OUTER_CURVE
            },
            net_weight: raw_branch_data.net_content_size,
            children,
            no_of_descendants: raw_branch_data.no_of_descendants,
            // this has to be updated to be offset by the end of the previous branch
            completion_window: {
                start: parent_completion_end,
                end: completion_end
            },
            canopy_radius: calculateCanopyRadius(raw_branch_data.net_content_size),
            position_on_parent: position_on_parent
        })
    }

    // first we need to obtain all the roots, they will each represent a tree
    const root_branch_ids = Array.from(raw_branch_data_map.keys()).filter(note_id => !note_id.includes('.'))

    return root_branch_ids.map(root_branch_id => {
        /**
         * this estimates the duration the longest branch will take to complete which can be used to calculate the start and end
         * of the completion window of each branch
         */
        const max_branch_volume: number = getMaxBranchVolume(root_branch_id, raw_branch_data_map)

        return rawBranchToTreeBranch(root_branch_id, 'left', 0, 0, max_branch_volume, true)
    })
}


export function calculateTreeDimensions(tree_data: TreeBranchData[]): BoxDimensions {

    function calculateBranchDimensions(branch_data: TreeBranchData) {
        let base_min_x = branch_data.branch_direction === 'left' && branch_data.branch_config.branch_type === BranchType.NORMAL ? -branch_data.branch_config.h_length : 0
        let base_max_x = branch_data.branch_direction === 'right' && branch_data.branch_config.branch_type === BranchType.NORMAL ? branch_data.branch_config.h_length : 0
        let base_max_y = branch_data.branch_config.branch_type === BranchType.TRUNK ? branch_data.branch_config.length : branch_data.branch_config.v_length

        let min_x = base_min_x - branch_data.canopy_radius
        let max_x = base_max_x + branch_data.canopy_radius
        let max_y = base_max_y + branch_data.canopy_radius

        branch_data.children.forEach(child_branch_data => {
            const [d_min_x, d_max_x, d_max_y] = calculateBranchDimensions(child_branch_data)
            min_x = Math.min(min_x, base_min_x + d_min_x)
            max_x = Math.max(max_x, base_max_x + d_max_x)
            max_y = Math.max(max_y, base_max_y * child_branch_data.position_on_parent + d_max_y)
        })

        StandardConsole.log('min_x', min_x, 'max_x', max_x, 'max_y', max_y, 'at branch', branch_data.id)

        return [min_x, max_x, max_y]
    }

    let min_x = 0
    let max_x = 0
    let max_y = 0

    tree_data.forEach(branch_data => {
        const [d_min_x, d_max_x, d_max_y] = calculateBranchDimensions(branch_data)
        min_x = Math.min(min_x, d_min_x)
        max_x = Math.max(max_x, d_max_x)
        max_y = Math.max(max_y, d_max_y)
    })

    return {
        width: max_x - min_x,
        height: max_y
    }
}