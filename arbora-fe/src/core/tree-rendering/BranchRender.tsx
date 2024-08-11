import React from 'react';
import {BranchState, BranchType, TreeBranchData} from "./types.ts";
import {Graphics, useTick} from "@pixi/react";
import {Graphics as PixiGraphics} from '@pixi/graphics'
import '@pixi/events'
import {Coords2D} from "../types.ts";
import {renderBranchV3, renderCanopy, renderTrunk} from "./helpers/render.ts";
import {TreeRenderContext} from "./TreeRender.tsx";
import {collapseDocumentView, setActiveDocument, setActiveNote} from "../redux/home/home_slice.ts";
import {store} from "../redux";
import {Note} from "../services/documents/types.ts";
import {recallProbabilityToColor} from "./helpers/color.ts";
import {CANOPY_GROWTH_RATE} from "./constants.ts";

interface BranchRenderProps {
    completion: number
    position: Coords2D
    tree_branch_data: TreeBranchData
    render_action: 'canopies' | 'branches'
}


function calculateOpacityAdjustDirection(current: number, target: number, tolerance: number) {
    if (Math.abs(current - target) < tolerance) {
        return 0
    } else if (current < target) {
        return 1
    } else {
        return -1
    }
}

function calculateCanopyColor(note_id: string, note: Note | undefined): string {
    if (!note) {
        return 'red'
    }
    return recallProbabilityToColor(note.recall_probability ?? Math.random(), note_id)

}

export default function BranchRender({completion, position, tree_branch_data, render_action}: BranchRenderProps) {
    const {document, hovered_branch_id, setHoveredBranchId, is_interactive} = React.useContext(TreeRenderContext)
    const branch_state: BranchState = React.useMemo(() => {
        if (hovered_branch_id?.startsWith(tree_branch_data.id)) {
            return BranchState.HIGHLIGHTED
        } else if (hovered_branch_id !== null) {
            return BranchState.HIDDEN
        } else {
            return BranchState.NORMAL
        }
    }, [hovered_branch_id, tree_branch_data.id]);

    const [branch_opacity, setBranchOpacity] = React.useState<number>(1)
    const [canopy_opacity, setCanopyOpacity] = React.useState<number>(0.8)
    const [canopy_completion, setCanopyCompletion] = React.useState<number>(0)

    const local_completion: number = React.useMemo(() => {
        return Math.max(0, Math.min(1, (completion - tree_branch_data.completion_window.start) / (tree_branch_data.completion_window.end - tree_branch_data.completion_window.start)))
    }, [completion, tree_branch_data.completion_window.start, tree_branch_data.completion_window.end]);

    const adjustBranchAndCanopyOpacity = React.useCallback((branch_opacity_target: number, canopy_opacity_target: number, delta: number) => {
        setBranchOpacity(value => {
            const direction = calculateOpacityAdjustDirection(value, branch_opacity_target, 0.05)
            return value + direction * 0.05 * delta
        })
        setCanopyOpacity(value => {
            const direction = calculateOpacityAdjustDirection(value, canopy_opacity_target, 0.05)
            return value + direction * 0.05 * delta
        })
    }, [setBranchOpacity, setCanopyOpacity]);
    useTick((delta) => {
        switch (branch_state) {
            case BranchState.HIDDEN:
                adjustBranchAndCanopyOpacity(0.1, 0.1, delta)
                break
            case BranchState.HIGHLIGHTED:
                adjustBranchAndCanopyOpacity(1, 0.9, delta)
                break
            case BranchState.NORMAL:
            default:
                adjustBranchAndCanopyOpacity(1, 0.8, delta)
        }
        if (local_completion >= 1 && canopy_completion < 1) {
            setCanopyCompletion(value => {
                return Math.min(1, value + CANOPY_GROWTH_RATE * delta / 60)
            })
        }
    })

    const drawBranch = React.useCallback((g: PixiGraphics) => {
        g.clear()
        if (tree_branch_data.branch_config.branch_type === BranchType.TRUNK) {
            g.beginFill('#704241', branch_opacity)
            renderTrunk(position, g, tree_branch_data.branch_config, local_completion)
            g.endFill()
        } else {
            g.beginFill('#704241', branch_opacity)
            renderBranchV3(position, g, tree_branch_data.branch_config, tree_branch_data.branch_direction, local_completion)
            g.endFill()
        }
    }, [tree_branch_data.branch_config, tree_branch_data.branch_direction, position, branch_opacity, local_completion])

    const drawCanopy = React.useCallback((g: PixiGraphics) => {
        const mul = tree_branch_data.branch_direction === 'left' ? -1 : 1
        const config = tree_branch_data.branch_config
        const branch_end: Coords2D = {
            x: position.x + mul * (config.branch_type === BranchType.TRUNK ? 0 : config.h_length),
            y: position.y - (config.branch_type === BranchType.TRUNK ? config.length : config.v_length)
        }
        g.clear()
        g.beginFill(calculateCanopyColor(tree_branch_data.id, document?.notes[tree_branch_data.id]), canopy_opacity)
        renderCanopy(branch_end, g, tree_branch_data.canopy_radius * canopy_completion)
        g.endFill()
    }, [tree_branch_data.canopy_radius, canopy_opacity, tree_branch_data.id, document?.notes, tree_branch_data.branch_direction, tree_branch_data.branch_config, position.x, position.y, canopy_completion])

    const selectBranch = React.useCallback(() => {
        store.dispatch(setActiveDocument(document))
        store.dispatch(setActiveNote(tree_branch_data.id))
        setTimeout(() => {
            store.dispatch(collapseDocumentView(false))
        }, 500)
    }, [tree_branch_data.id, document]);

    return (
        <React.Fragment>
            {render_action === 'branches' && (
                <Graphics draw={drawBranch}
                          eventMode={'dynamic'}
                          isInteractive={() => is_interactive}
                          onmouseenter={() => setHoveredBranchId(tree_branch_data.id)}
                          pointerdown={selectBranch}
                          onmouseleave={() => setHoveredBranchId(null)}/>
            )}

            {tree_branch_data.children.map((child) => {
                const child_position: Coords2D = {
                    x: position.x + (child.rel_position.x - tree_branch_data.rel_position.x),
                    y: position.y + (child.rel_position.y - tree_branch_data.rel_position.y)
                }
                return <BranchRender key={child.id} position={child_position} tree_branch_data={child}
                                     render_action={render_action} completion={completion}/>
            })}
            {render_action === 'canopies' && (
                <Graphics draw={drawCanopy}
                          eventMode={'dynamic'}
                          isInteractive={() => is_interactive}
                          onmouseenter={() => setHoveredBranchId(tree_branch_data.id)}
                          onmouseleave={() => setHoveredBranchId(null)}
                          onpointerdown={selectBranch}/>
            )}
        </React.Fragment>
    )
}