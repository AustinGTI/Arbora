import React from 'react';
import {Document} from "../services/documents/types.ts";
import {TreeData} from "./types.ts";
import BranchRender from "./BranchRender.tsx";
import {StandardConsole} from "../helpers/logging.ts";
import TextRender from "./TextRender.tsx";

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
                        x: position.x,
                        y: position.y - dimensions.height
                    }} document={document} note={hovered_branch_id}/>
            )}
            {root_branches.map((branch, idx) => {
                return <BranchRender key={branch.id} position={{
                    x: position.x + 200 * idx,
                    y: position.y
                }} tree_branch_data={branch}/>
            })}
        </TreeRenderContext.Provider>
    )
}