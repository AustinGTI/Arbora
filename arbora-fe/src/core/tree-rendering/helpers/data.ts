import {BranchDirection, BranchType, RawBranchData, TreeBranchData} from "../types.ts";
import {getMaxBranchVolume} from "./data-utils.ts";
import {
    BRANCH_INNER_CURVE,
    BRANCH_OUTER_CURVE,
    calculateBranchGirth,
    calculateBranchHorizontalLength,
    calculateBranchVerticalLength,
    calculateCanopyRadius,
    calculatePositionOnParent,
    calculateTrunkGirth,
    calculateTrunkLength,
    MIN_BRANCH_TAPER,
    TRUNK_ROUNDNESS
} from "./constants.ts";


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
            position_on_parent: position_on_parent,
            rel_position: {x: 0, y: 0}
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


