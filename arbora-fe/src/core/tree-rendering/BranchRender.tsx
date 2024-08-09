import React from 'react';
import {BranchState, BranchType, TreeBranchData} from "./types.ts";
import {Graphics, useTick} from "@pixi/react";
import {Graphics as PixiGraphics} from '@pixi/graphics'
import '@pixi/events'
import {Coords2D} from "../types.ts";
import {renderBranchV2, renderCanopy, renderTrunk} from "./helpers/render.ts";
import {TreeRenderContext} from "./TreeRender.tsx";
import {setActiveDocument, setActiveNote} from "../redux/home/home_slice.ts";
import {store} from "../redux";
import "@pixi/events"
import {calculateGreenShade} from "../helpers/colors.ts";

interface BranchRenderProps {
    position: Coords2D
    tree_branch_data: TreeBranchData
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


export default function BranchRender({position, tree_branch_data}: BranchRenderProps) {
    const {document, hovered_branch_id, setHoveredBranchId} = React.useContext(TreeRenderContext)

    const [next_position, setNextPosition] = React.useState<Coords2D | null>(null)
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
    const [canopy_opacity, setCanopyOpacity] = React.useState<number>(0.6)

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
                adjustBranchAndCanopyOpacity(0.9, 0.6, delta)
        }
    })

    const drawBranch = React.useCallback((g: PixiGraphics) => {
        g.clear()
        if (tree_branch_data.branch_config.branch_type === BranchType.TRUNK) {
            g.beginFill('#704241', branch_opacity)
            setNextPosition(renderTrunk(position, g, tree_branch_data.branch_config))
            g.endFill()
        } else {
            const girth = tree_branch_data.branch_config.girth
            g.beginFill('#704241', 0)
            g.lineStyle(girth, '#704241', branch_opacity)
            setNextPosition(renderBranchV2(position, g, tree_branch_data.branch_config, tree_branch_data.branch_direction))
            g.endFill()
        }
    }, [tree_branch_data.branch_config, tree_branch_data.branch_direction, setNextPosition, position, branch_opacity])

    const drawCanopy = React.useCallback((g: PixiGraphics) => {
        if (!next_position) return
        g.clear()
        g.beginFill(calculateGreenShade(tree_branch_data.id), canopy_opacity)
        renderCanopy(next_position, g, tree_branch_data.canopy_radius)
        g.endFill()
    }, [next_position, tree_branch_data.canopy_radius, canopy_opacity, tree_branch_data.id])

    const selectBranch = React.useCallback(() => {
        store.dispatch(setActiveDocument(document))
        store.dispatch(setActiveNote(null))
        setTimeout(() => {
            store.dispatch(setActiveNote(tree_branch_data.id))
        }, 500)
    }, [tree_branch_data.id, document]);


    return (
        <React.Fragment>
            <Graphics draw={drawBranch}
                      eventMode={'dynamic'}
                      onpointerenter={() => setHoveredBranchId(tree_branch_data.id)}
                      onpointerleave={() => setHoveredBranchId(null)}/>

            {next_position && tree_branch_data.children.map((child) => {
                const child_position: Coords2D = {
                    x: position.x + (child.rel_position.x - tree_branch_data.rel_position.x),
                    y: position.y + (child.rel_position.y - tree_branch_data.rel_position.y)
                }
                return <BranchRender key={child.id} position={child_position} tree_branch_data={child}/>
            })}
            <Graphics draw={drawCanopy}
                      eventMode={'dynamic'}
                      onpointerenter={() => setHoveredBranchId(tree_branch_data.id)}
                      onpointerleave={() => setHoveredBranchId(null)}
                      pointerdown={selectBranch}/>
        </React.Fragment>
    )
}