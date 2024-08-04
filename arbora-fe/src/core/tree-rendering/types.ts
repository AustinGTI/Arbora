import {BoxDimensions, Coords2D} from "../types.ts";
import {Document} from "../services/documents/types.ts";

export interface RawBranchData {
    id: string
    no_of_descendants: number
    children: string[]
    net_content_size: number
    gross_content_size: number
}

interface CompletionWindow {
    start: number
    end: number
}

export enum BranchType {
    TRUNK = 'trunk',
    NORMAL = 'normal',
}

export type BranchDirection = 'left' | 'right'


export interface TrunkBranchConfig {
    branch_type: BranchType.TRUNK
    girth: number
    length: number
    taper: number
    roundness: number
}

export interface NormalBranchConfig {
    branch_type: BranchType.NORMAL
    girth: number
    h_length: number
    v_length: number
    taper: number
    inner_curve: number
    outer_curve: number
}

export interface TreeBranchData {
    id: string
    branch_direction: BranchDirection
    branch_config: NormalBranchConfig | TrunkBranchConfig
    position_on_parent: number
    completion_window: CompletionWindow
    net_weight: number
    canopy_radius: number
    children: TreeBranchData[]
    no_of_descendants: number
}

export interface TreeData {
    root_branches: TreeBranchData[]
    position: Coords2D
    document: Document
    dimensions: BoxDimensions
}

export enum BranchState {
    NORMAL = 'normal',
    HIGHLIGHTED = 'highlighted',
    HIDDEN = 'hidden',
}