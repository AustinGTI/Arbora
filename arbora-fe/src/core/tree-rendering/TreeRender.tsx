import React from 'react';
import {Document} from "../services/documents/types.ts";
import {TreeData} from "./types.ts";
import BranchRender from "./BranchRender.tsx";
import {StandardConsole} from "../helpers/logging.ts";
import TextRender from "./TextRender.tsx";
import {Coords2D} from "../types.ts";
import {useTick} from "@pixi/react";
import {TREE_EDGE_THRESHOLD} from "../../pages/home/sections/all-documents/forest-canvas/constants.ts";
import {
    CanvasMotionControllerContext
} from "../../pages/home/sections/all-documents/forest-canvas/motion-control/CanvasMotionController.tsx";
import {TREE_GROWTH_RATE} from "./constants.ts";


interface TreeRenderProps {
    tree_data: TreeData
    is_interactive: boolean,
    hovered_document_note_id: string | null
    setHoveredDocumentNoteId: (id: string | null) => void
}

interface TreeRenderContextProps {
    is_interactive: boolean
    document: Document | null
    hovered_branch_id: string | null
    setHoveredBranchId: (id: string | null) => void
}

export const TreeRenderContext = React.createContext<TreeRenderContextProps>({
    is_interactive: true,
    document: null,
    hovered_branch_id: null,
    setHoveredBranchId: () => {
    }
})

export default function TreeRender({
                                       tree_data: {position, document, root_branches, dimensions},
                                       is_interactive,
                                       hovered_document_note_id,
                                       setHoveredDocumentNoteId
                                   }: TreeRenderProps) {
    const [tree_position, setTreePosition] = React.useState<Coords2D>(position)
    const [completion, setCompletion] = React.useState<number>(0)

    const {
        motion_speed, canvas_box_rect: rect,
        active_tree_id, setActiveTreeXPos
    } = React.useContext(CanvasMotionControllerContext)

    // if this is the active tree, set the active tree x position
    React.useEffect(() => {
        if (active_tree_id === document?.id) {
            setActiveTreeXPos(tree_position.x)
        }
    }, [active_tree_id])
    useTick((delta) => {
        let new_x = tree_position.x + motion_speed * delta
        // if x is past the width of the canvas, reset it to the start
        if (rect && new_x > rect.width + TREE_EDGE_THRESHOLD) {
            new_x = -TREE_EDGE_THRESHOLD
        }
        if (rect && new_x < -TREE_EDGE_THRESHOLD) {
            new_x = rect.width + TREE_EDGE_THRESHOLD
        }
        setTreePosition({
            x: new_x,
            y: tree_position.y
        })

        if (completion < 1) {
            setCompletion(value => {
                    return Math.min(1, value + TREE_GROWTH_RATE * delta / 60)
                }
            )
        }
    })

    const hovered_branch_id: string | null = React.useMemo(() => {
        if (hovered_document_note_id === null) {
            return null
        } else {
            // get the document id and compare it to the current tree's document id
            const parts = hovered_document_note_id.split('|')
            const document_id = parts.slice(0, -1).join('')
            if (document_id !== document?.id) {
                return null
            }
            return parts.slice(-1)[0]
        }
    }, [document.id, hovered_document_note_id]);

    const setHoveredBranchId = React.useCallback((branch_id: string | null) => {
        if (branch_id === null) {
            setHoveredDocumentNoteId(null)
        } else {
            setHoveredDocumentNoteId(`${document?.id}|${branch_id}`)
        }
    }, [setHoveredDocumentNoteId, document?.id]);


    const context: TreeRenderContextProps = React.useMemo(() => {
        return {
            is_interactive,
            document,
            hovered_branch_id,
            setHoveredBranchId
        }
    }, [hovered_branch_id, setHoveredBranchId, document, is_interactive]);

    React.useEffect(() => {
        StandardConsole.log('hovered_branch_id', hovered_branch_id)
    }, [hovered_branch_id]);

    return (
        <TreeRenderContext.Provider value={context}>
            {hovered_branch_id && (
                <TextRender
                    position={{
                        x: tree_position.x,
                        y: tree_position.y - dimensions.height
                    }} document={document} note={hovered_branch_id}/>
            )}
            {root_branches.map((branch, idx) => {
                return <BranchRender key={branch.id + '-branches'} position={{
                    x: tree_position.x + 200 * idx,
                    y: tree_position.y
                }} tree_branch_data={branch} render_action={'branches'} completion={completion}/>
            })}
            {root_branches.map((branch, idx) => {
                return <BranchRender key={branch.id + '-canopies'} position={{
                    x: tree_position.x + 200 * idx,
                    y: tree_position.y
                }} tree_branch_data={branch} render_action={'canopies'} completion={completion}/>
            })}
        </TreeRenderContext.Provider>
    )
}