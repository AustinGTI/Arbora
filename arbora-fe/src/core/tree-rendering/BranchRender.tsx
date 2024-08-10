import React from 'react';
import {BranchState, BranchType, TreeBranchData} from "./types.ts";
import {Graphics, useTick} from "@pixi/react";
import {Graphics as PixiGraphics} from '@pixi/graphics'
import '@pixi/events'
import {Coords2D} from "../types.ts";
import {renderBranchV2, renderCanopy, renderTrunk} from "./helpers/render.ts";
import {TreeRenderContext} from "./TreeRender.tsx";
import {collapseDocumentView, setActiveDocument, setActiveNote} from "../redux/home/home_slice.ts";
import {store} from "../redux";
import {Note} from "../services/documents/types.ts";
import {recallProbabilityToColor} from "./helpers/color.ts";

interface BranchRenderProps {
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


export default function BranchRender({position, tree_branch_data, render_action}: BranchRenderProps) {
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

    const adjustBranchAndCanopyOpacity = React.useCallback((branch_opacity_target: number, canopy_opacity_target: number, delta: number) => {
        setBranchOpacity(value => {
            const direction = calculateOpacityAdjustDirection(value, branch_opacity_target, 0.1)
            return value + direction * 0.1 * delta
        })
        setCanopyOpacity(value => {
            const direction = calculateOpacityAdjustDirection(value, canopy_opacity_target, 0.1)
            return value + direction * 0.1 * delta
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
                adjustBranchAndCanopyOpacity(0.9, 0.8, delta)
        }
    })

    const drawBranch = React.useCallback((g: PixiGraphics) => {
        g.clear()
        if (tree_branch_data.branch_config.branch_type === BranchType.TRUNK) {
            g.beginFill('#704241', branch_opacity)
            renderTrunk(position, g, tree_branch_data.branch_config)
            g.endFill()
        } else {
            const girth = tree_branch_data.branch_config.girth
            g.beginFill('#704241', 0)
            g.lineStyle(girth, '#704241', branch_opacity)
            renderBranchV2(position, g, tree_branch_data.branch_config, tree_branch_data.branch_direction)
            g.endFill()
        }
    }, [tree_branch_data.branch_config, tree_branch_data.branch_direction, position, branch_opacity])

    const drawCanopy = React.useCallback((g: PixiGraphics) => {
        const mul = tree_branch_data.branch_direction === 'left' ? -1 : 1
        const config = tree_branch_data.branch_config
        const branch_end: Coords2D = {
            x: position.x + mul * (config.branch_type === BranchType.TRUNK ? 0 : config.h_length),
            y: position.y - (config.branch_type === BranchType.TRUNK ? config.length : config.v_length)
        }
        g.clear()
        g.beginFill(calculateCanopyColor(tree_branch_data.id, document?.notes[tree_branch_data.id]), canopy_opacity)
        renderCanopy(branch_end, g, tree_branch_data.canopy_radius)
        g.endFill()
    }, [tree_branch_data.canopy_radius, canopy_opacity, tree_branch_data.id, document?.notes, tree_branch_data.branch_direction, tree_branch_data.branch_config, position.x, position.y])

    const selectBranch = React.useCallback(() => {
        console.log('selecting branch and document')
        store.dispatch(setActiveDocument(document))
        setTimeout(() => {
            store.dispatch(setActiveNote(tree_branch_data.id))
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
                          pointerdown={() => console.log('tapped')}
                          onmouseleave={() => setHoveredBranchId(null)}/>
            )}

            {tree_branch_data.children.map((child) => {
                const child_position: Coords2D = {
                    x: position.x + (child.rel_position.x - tree_branch_data.rel_position.x),
                    y: position.y + (child.rel_position.y - tree_branch_data.rel_position.y)
                }
                return <BranchRender key={child.id} position={child_position} tree_branch_data={child}
                                     render_action={render_action}/>
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