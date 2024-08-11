import React from 'react';
import useIsSiteIdle from "./hooks/useIsSiteIdle.tsx";
import useScrollHorizontally from "./hooks/useScrollHorizontally.tsx";
import useMotionSpeed from "./hooks/useMotionSpeed.tsx";
import useMoveToActiveDocumentTree from "./hooks/useMoveToActiveDocumentTree.tsx";
import {RectProps} from "../../../../../../core/types.ts";
import {MIN_CANVAS_WIDTH} from "../constants.ts";
import {store} from "../../../../../../core/redux";
import {TreeData} from "../../../../../../core/tree-rendering/types.ts";


interface CanvasMotionControllerContextProps {
    active_tree_id: string | null
    setActiveTreeXPos : (x_pos: number) => void
    motion_speed: number
    canvas_box_rect: RectProps
}

export const CanvasMotionControllerContext = React.createContext<CanvasMotionControllerContextProps>({
    active_tree_id: null,
    motion_speed: 0,
    canvas_box_rect: {x: 0, y: 0, width: MIN_CANVAS_WIDTH, height: 600},
    setActiveTreeXPos: () => null
})

interface CanvasMotionControllerProps {
    tree_data: TreeData[]
    canvas_box_rect: RectProps
    children: React.ReactNode
}

export default function CanvasMotionController({canvas_box_rect, children}: CanvasMotionControllerProps) {
    const {documents: {active_document}, document_view: {collapsed}} = store.getState().home
    const [active_tree_x_pos, setActiveTreeXPos] = React.useState<number | null>(null)

    const {motion_speed, setMotionSpeed} = useMotionSpeed()
    const is_idle = useIsSiteIdle()

    useMoveToActiveDocumentTree(active_tree_x_pos, motion_speed, setMotionSpeed, canvas_box_rect)
    useScrollHorizontally()

    // when idle and not collapsed, set motion to -1 else set motion to 0
    React.useEffect(() => {
        if (is_idle && collapsed) {
            setMotionSpeed(-0.5)
        } else {
            if (!active_document) {
                setMotionSpeed(0)
            }
        }
    }, [is_idle, collapsed]);

    React.useEffect(() => {
        if (!active_document) {
            setActiveTreeXPos(null)
        }
    }, []);
    const context: CanvasMotionControllerContextProps = React.useMemo(() => {
        return {
            motion_speed,
            canvas_box_rect,
            active_tree_id: active_document ? active_document.id : null,
            setActiveTreeXPos
        }
    }, [motion_speed, canvas_box_rect, active_document, setActiveTreeXPos]);

    return (
        <CanvasMotionControllerContext.Provider value={context}>
            {children}
        </CanvasMotionControllerContext.Provider>
    )
}