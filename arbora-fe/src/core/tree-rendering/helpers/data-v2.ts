import {BranchDirection, BranchType, RawBranchData, TreeBranchData} from "../types.ts";
import {addNoise, getMaxBranchVolume} from "./data-utils.ts";
import {
    BRANCH_INNER_CURVE,
    BRANCH_OUTER_CURVE, calculateBranchGirth,
    calculateCanopyRadius,
     calculateTrunkGirth, calculateTrunkLength,
    MIN_BRANCH_TAPER, TRUNK_ROUNDNESS
} from "./constants.ts";
import {Coords2D} from "../../types.ts";
import {StandardConsole} from "../../helpers/logging.ts";

interface CanopyData {
    position: Coords2D
    radius: number
}

const STEP_SIZE = 5
const NO_OF_RAYS = 16
const AVOIDANCE_FACTOR = 0.7

const BRANCH_OFFSET_FROM_ROOT = 30

const MAX_STEPS = 300

// branches at 90 degrees from their roots
const IDEAL_BRANCH_ANGLE = 30
const IDEAL_BRANCH_ANGLE_WEIGHT = 0.5


function calculateClosestVacantSpaceAlongRay(start_pos: Coords2D, angle: number, radius: number, canopies: CanopyData[]): [Coords2D, number] | null {
    const sin_theta = Math.sin(angle * Math.PI / 180)
    const cos_theta = Math.cos(angle * Math.PI / 180)

    for (let i = 0; i < MAX_STEPS; i++) {
        const x = start_pos.x + (i * STEP_SIZE + BRANCH_OFFSET_FROM_ROOT) * sin_theta
        const y = start_pos.y - (i * STEP_SIZE + BRANCH_OFFSET_FROM_ROOT) * cos_theta

        // StandardConsole.log('with angle', angle, 'at step', i, 'x:', x, 'y:', y, 'from start pos', start_pos)

        // if distance between xy and any canopy is less than (the canopy radius + radius) * avoidance factor, continue search
        if (canopies.every(canopy => Math.hypot(canopy.position.x - x, canopy.position.y - y) > (canopy.radius + radius) * (AVOIDANCE_FACTOR * radius/100))) {
            return [{x, y}, i * STEP_SIZE]
        }
    }

    StandardConsole.warn('Could not find a vacant space along ray')
    return null

}

function calculateBranchHLengthAndVLength(raw_branch_data: RawBranchData, rel_position: Coords2D, direction: BranchDirection, canopies: CanopyData[]): [number, number] {
    const closest_vacant_points: [Coords2D, number, number][] = Array.from({length: NO_OF_RAYS}, (_, i) => {
        const angle = 90 / (NO_OF_RAYS + 1) * (i + 1)

        const offset_from_ideal_multiplier = 1 + (Math.abs(angle - IDEAL_BRANCH_ANGLE) / 90) * IDEAL_BRANCH_ANGLE_WEIGHT

        const space_pos_and_dist = calculateClosestVacantSpaceAlongRay(rel_position, (direction === 'left' ? -1 : 1) * angle, calculateCanopyRadius(raw_branch_data.gross_content_size), canopies)

        if (space_pos_and_dist === null) {
            return null
        }
        return [space_pos_and_dist[0], space_pos_and_dist[1], offset_from_ideal_multiplier]
    }).filter(point => point !== null) as [Coords2D, number, number][]

    // if there are no points return null
    if (!closest_vacant_points.length) {
        return [calculateCanopyRadius(raw_branch_data.gross_content_size), calculateCanopyRadius(raw_branch_data.gross_content_size)]
    }

    // multiply dist and offset multiplier and return the lowest dist
    const closest_vacant_point: [Coords2D | null, number] = closest_vacant_points.reduce((acc, point) => {
        const dist = point[1] * point[2]
        if (dist < acc[1]) {
            return [point[0], dist]
        }
        return acc
    }, [null, Infinity] as [Coords2D | null, number])


    return [
        closest_vacant_point[0]!.x - rel_position.x,
        closest_vacant_point[0]!.y - rel_position.y
    ]

}

export function generateTreeBranchDataV2(raw_branch_data_map: Map<string, RawBranchData>): TreeBranchData[] {
    const canopies: CanopyData[] = []

    function rawBranchToTreeBranch(raw_branch_id: string, direction: BranchDirection, rel_position: Coords2D, parent_completion_end: number, max_branch_volume: number, is_root: boolean = true): TreeBranchData {
        let weight_balance = 0
        const raw_branch_data = raw_branch_data_map.get(raw_branch_id)!
        const completion_end = parent_completion_end + (raw_branch_data.gross_content_size * raw_branch_data.no_of_descendants) / max_branch_volume

        // region POSITION DATA
        // ? ........................

        const [h_length, v_length] = is_root ? [0, -calculateTrunkLength(raw_branch_data.no_of_descendants)] : calculateBranchHLengthAndVLength(raw_branch_data, rel_position, direction, canopies)

        StandardConsole.log('h and v are ', h_length, v_length)
        if (v_length > 0) {
            StandardConsole.log('v length is positive',v_length,'for ', raw_branch_id)
        }

        canopies.push({
            position: {
                x: rel_position.x + h_length,
                y: rel_position.y + v_length
            },
            radius: calculateCanopyRadius(raw_branch_data.net_content_size)
        })

        // ? ........................
        // endregion ........................

        // sort the children by gross content size, the order is used to decide the positioning on the parent,
        const sorted_children_ids : string[] = raw_branch_data.children.sort((a,b) => {
            return raw_branch_data_map.get(a)!.gross_content_size - raw_branch_data_map.get(b)!.gross_content_size
        })

        const children = sorted_children_ids.map((raw_branch_child_id,index) => {
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

            // const position_on_parent = calculatePositionOnParent(raw_branch_data_map.get(raw_branch_child_id)!.gross_content_size, raw_branch_data.gross_content_size)
            const position_on_parent = addNoise(0.2 + ((index + 1)/sorted_children_ids.length * 0.6),0.1)

            const child_rel_pos = {x: rel_position.x, y: rel_position.y}

            if (is_root) {
                child_rel_pos.x = rel_position.x
            } else {
                child_rel_pos.x = rel_position.x + h_length
            }
            child_rel_pos.y = rel_position.y + v_length * position_on_parent


            return rawBranchToTreeBranch(
                raw_branch_child_id,
                // position on parent is the child gross content size divided by the parent gross content size
                direction,
                child_rel_pos,
                completion_end, max_branch_volume,
                false);
        })

        // taper is the (gross_content - net_content)/gross_content
        const taper = MIN_BRANCH_TAPER + (1 - MIN_BRANCH_TAPER) * (raw_branch_data.gross_content_size - raw_branch_data.net_content_size) / raw_branch_data.gross_content_size

        return {
            id: raw_branch_id,
            branch_direction: direction,
            branch_config: is_root ? {
                branch_type: BranchType.TRUNK,
                girth: calculateTrunkGirth(raw_branch_data.gross_content_size),
                length: Math.abs(v_length),
                // taper is the children gross content size divided by the parent gross content size
                taper,
                roundness: TRUNK_ROUNDNESS
            } : {
                branch_type: BranchType.NORMAL,
                girth: calculateBranchGirth(raw_branch_data.gross_content_size),
                h_length: Math.abs(h_length),
                v_length: Math.abs(v_length),
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
            position_on_parent: 2,
            rel_position
        }
    }

    // first we need to obtain all the roots, they will each represent a tree
    const root_branch_ids = Array.from(raw_branch_data_map.keys()).filter(note_id => !note_id.includes('.'))

    return root_branch_ids.map(root_branch_id => {
        /**
         * this estimates the duration the longest branch will take to complete which can be used to calculate the start and end
         * of the completion window of each branch
         */
        const max_branch_volume: number = getMaxBranchVolume(root_branch_id, raw_branch_data_map)

        return rawBranchToTreeBranch(root_branch_id, 'left', {x: 0, y: 0}, 0, max_branch_volume, true)
    })
}

