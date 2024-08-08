import {TreeData} from "../../../../../../core/tree-rendering/types.ts";
import React from "react";
import {StandardConsole} from "../../../../../../core/helpers/logging.ts";
import {TREE_EDGE_THRESHOLD} from "../constants.ts";
import {
    setCanvasMotion,
} from "../../../../../../core/redux/home/home_slice.ts";
import {store} from "../../../../../../core/redux";
import useCanvasMotion from "../../../../../../core/redux/home/hooks/useCanvasMotion.tsx";
import {useTick} from "@pixi/react";
import { easeOut} from "../../../../../../core/helpers/math.ts";

const MOVE_SPEED = 20

const WAIT_PER_MOTION_UPDATE = 100

/**
 * move the canvas such that the active document is centered
 */
export default function useMoveToActiveDocument(tree_data: TreeData[]) {
    const {
        documents: {active_document},
        document_view: {},
        all_documents_view: {canvas_box_rect}
    } = store.getState().home

    const {motion} = useCanvasMotion()

    const seconds_to_target = React.useRef<number | null>(null);

    const cumulative_delta = React.useRef<number>(0)

    const tweenCanvasMotion = React.useCallback((total_dist: number, max_speed: number) => {
        seconds_to_target.current = total_dist

        const mul = Math.sign(total_dist)

        total_dist = Math.abs(total_dist)

        store.dispatch(setCanvasMotion(mul * 0.2))

        let interval: number;
        // @ts-ignore
        interval = setInterval(() => {
            if (seconds_to_target.current === null) {
                clearInterval(interval)
                return
            }
            // calculate the distance moved so far, then update canvas motion based on that
            const proportion_covered = (total_dist - Math.abs(seconds_to_target.current)) / total_dist
            const new_speed = mul * easeOut(proportion_covered, max_speed)

            StandardConsole.log('setting speed to ', new_speed, 'at proportion', proportion_covered)

            store.dispatch(setCanvasMotion(new_speed))
        }, WAIT_PER_MOTION_UPDATE)
    }, []);

    useTick((delta) => {
        cumulative_delta.current += delta * motion

        if (seconds_to_target.current === null) {
            return
        }
        StandardConsole.log('seconds to target are', seconds_to_target.current)
        // if seconds to target is a number and more than 0, subtract by delta
        if ((seconds_to_target.current > 0 && motion > 0) || (seconds_to_target.current < 0 && motion < 0)) {
            seconds_to_target.current -= delta * motion
        } else {
            // stop motion and set seconds to target to null
            store.dispatch(setCanvasMotion(0))
            seconds_to_target.current = null
        }

    })
    React.useEffect(() => {
        if (!active_document) {
            // set the canvas motion back to 1 if there is no active document
            if (motion === 0) {
                store.dispatch(setCanvasMotion(-1))
            }
            return
        }
        if (!canvas_box_rect) {
            StandardConsole.warn('There is not canvas box rect yet')
            return
        }
        // first we get the original position of the active document
        const active_document_tree_data = tree_data.find((tree) => tree.document.id === active_document.id)
        if (!active_document_tree_data) {
            return
        }
        const original_position = active_document_tree_data.position

        // using the motion delta, we calculate its current x position
        const curr_x = (original_position.x + cumulative_delta.current) % (canvas_box_rect.width + 2 * TREE_EDGE_THRESHOLD)

        const tgt_x = 200 // for now

        const distance_to_target = tgt_x - curr_x

        setTimeout(() => {
            tweenCanvasMotion(distance_to_target, MOVE_SPEED)
        }, 500)
    }, [active_document]);


    return null
}