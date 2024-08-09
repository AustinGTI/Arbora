import {BranchType, RawBranchData, TreeBranchData} from "../types.ts";
import {Document} from "../../services/documents/types.ts";
import {BoxDimensions, Coords2D} from "../../types.ts";

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

export function addNoise(value: number, noise: number): number {
    return value + value * 2 * noise * (Math.random() - 0.5)
}

export function getMaxBranchVolume(root_branch_id: string, raw_branch_data_map: Map<string, RawBranchData>): number {
    // recursively get the max branch volume
    const root_branch_data = raw_branch_data_map.get(root_branch_id)!
    const volume = root_branch_data.gross_content_size * root_branch_data.no_of_descendants
    let max_child_volume = 0
    root_branch_data.children.forEach(child_id => {
        max_child_volume = Math.max(max_child_volume, getMaxBranchVolume(child_id, raw_branch_data_map))
    })
    return volume + max_child_volume
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

export function calculateChildPositions(
    tree_branch_data: TreeBranchData,
    parent_position: Coords2D,
): Map<string, Coords2D> {
    const map = new Map<string, Coords2D>()

    tree_branch_data.children.forEach(child_branch_data => {
        const relative_position = child_branch_data.position_on_parent
        if (tree_branch_data.branch_config.branch_type === BranchType.TRUNK) {
            // if trunk, the child positions are along the trunk from the root
            map.set(
                child_branch_data.id,
                {
                    x: parent_position.x,
                    y: parent_position.y - tree_branch_data.branch_config.length * relative_position
                }
            )
        } else {
            // first we get to the bottom of the vertical section
            map.set(child_branch_data.id, {
                x: parent_position.x + (tree_branch_data.branch_direction === 'left' ? -1 : 1) * tree_branch_data.branch_config.h_length,
                y: parent_position.y - tree_branch_data.branch_config.v_length * relative_position
            })
        }
    })

    return map
}