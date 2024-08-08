import React from 'react';
import {Document} from "../services/documents/types.ts";
import {TreeData} from "./types.ts";
import BranchRender from "./BranchRender.tsx";
import {StandardConsole} from "../helpers/logging.ts";
import TextRender from "./TextRender.tsx";
import {Coords2D} from "../types.ts";
import {useTick} from "@pixi/react";
import useCanvasMotion from "../redux/home/hooks/useCanvasMotion.tsx";
import {TREE_EDGE_THRESHOLD} from "../../pages/home/sections/all-documents/forest-canvas/constants.ts";

interface TreeRenderProps {
    tree_data: TreeData
}

interface TreeRenderContextProps {
    document: Document | null
    hovered_branch_id: string | null
    setHoveredBranchId: (id: string | null) => void
}

export const TreeRenderContext = React.createContext<TreeRenderContextProps>({
    document: null,
    hovered_branch_id: null,
    setHoveredBranchId: () => {
    }
})

export default function TreeRender({tree_data: {position, document, root_branches, dimensions}}: TreeRenderProps) {
    const [hovered_branch_id, setHoveredBranchId] = React.useState<string | null>(null)

    const [tree_position, setTreePosition] = React.useState<Coords2D>(position)

    const {rect, motion} = useCanvasMotion()

    useTick((delta) => {
        let new_x = tree_position.x + motion * delta
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
    })

    const context = React.useMemo(() => {
        return {
            document,
            hovered_branch_id,
            setHoveredBranchId
        }
    }, [hovered_branch_id, setHoveredBranchId, document]);

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
                return <BranchRender key={branch.id} position={{
                    x: tree_position.x + 200 * idx,
                    y: tree_position.y
                }} tree_branch_data={branch}/>
            })}
        </TreeRenderContext.Provider>
    )
}