import React from 'react';
import {FAST_MOTION_ACCELERATION, UPDATES_PER_SECOND} from "../constants.ts";
import {TREE_EDGE_THRESHOLD} from "../../constants.ts";
import {StandardConsole} from "../../../../../../../core/helpers/logging.ts";
import {CanvasBoxRect} from "../../../../../../../core/redux/home/home_slice.ts";
import {MotionType} from "./useMotionSpeed.tsx";


/**
 * this calculates the time and distance it takes to change speed from initial to final
 * @param initial_speed
 * @param final_speed
 */
function calculateSpeedChangeTimeAndDist(initial_speed: number, final_speed: number): [number, number] {
    let dist = 0
    let t = 0
    const change_sign = Math.sign(final_speed - initial_speed)
    while (final_speed * change_sign > initial_speed * change_sign) {
        initial_speed += FAST_MOTION_ACCELERATION / UPDATES_PER_SECOND * change_sign
        if (initial_speed * change_sign > final_speed * change_sign) {
            initial_speed = final_speed
        }
        dist += initial_speed * 60 * (1 / UPDATES_PER_SECOND)
        t += (1 / UPDATES_PER_SECOND)
    }
    return [t, dist]
}

const BINARY_SEARCH_DEPTH = 50

/**
 * this uses binary search to determine the target speed and stop time to move from one distance to another
 * as fast as possible given the acceleration limit and current speed
 */
function calculatePeakMoveSpeed(motion_speed: number, dist: number): [number, number] {
    let curr_speed = 0

    for (let i = 0; i <= BINARY_SEARCH_DEPTH; i++) {
        // we get the sum of the distance on change from motion_speed to curr_speed and curr_speed to 0
        const [t1, dist1] = calculateSpeedChangeTimeAndDist(motion_speed, curr_speed)
        const [_t2, dist2] = calculateSpeedChangeTimeAndDist(curr_speed, 0)

        if (i == BINARY_SEARCH_DEPTH) {
            StandardConsole.log('after bin search dist estimate is ', dist1 + dist2, 'compared to ', dist)
            return [curr_speed, t1]
        }

        if (dist1 + dist2 > dist) {
            curr_speed -= 32 * Math.pow(2, -i)
        } else {
            curr_speed += 32 * Math.pow(2, -i)
        }
    }

    return [0, 0]
}

StandardConsole.log('calculating speed change time and dist')
StandardConsole.log(calculateSpeedChangeTimeAndDist(0, 10))
StandardConsole.log(calculateSpeedChangeTimeAndDist(10, 0))
StandardConsole.log(calculateSpeedChangeTimeAndDist(0, 5))

/**
 * calculates the delta in motion of the canvas starting from mount
 * this can be used to calculate the precise position of trees based on their starting position
 * by adding to the delta and modding it by the width of the canvas
 * @param active_tree_x
 * @param motion_speed
 * @param setMotionSpeed
 * @param canvas_box_rect
 */
export default function useMoveToActiveDocumentTree(
    active_tree_x: number | null,
    motion_speed: number,
    setMotionSpeed: (speed: number, type: MotionType) => void,
    canvas_box_rect: CanvasBoxRect
) {
    React.useEffect(() => {
        if (!active_tree_x) return

        const real_canvas_width = canvas_box_rect.canvas_width + 2 * TREE_EDGE_THRESHOLD

        const target_x = canvas_box_rect.window_width / 4

        if (target_x === active_tree_x) return

        let diff;

        if (target_x > active_tree_x) {
            if (target_x - active_tree_x <= real_canvas_width - target_x + active_tree_x) {
                diff = target_x - active_tree_x
            } else {
                diff = -(real_canvas_width - target_x + active_tree_x)
            }
        } else {
            if (active_tree_x - target_x <= real_canvas_width - active_tree_x + target_x) {
                diff = target_x - active_tree_x
            } else {
                diff = real_canvas_width - active_tree_x + target_x
            }
        }

        const [target_speed, stop_time] = calculatePeakMoveSpeed(motion_speed, diff)

        StandardConsole.log('curr motion is', motion_speed)
        StandardConsole.log('real canvas width is ', real_canvas_width, 'active tree x is ', active_tree_x, 'target x is ', target_x)
        StandardConsole.log('diff to target is ', diff, ' calculated that ideal target speed is ', target_speed, 'with a stop in ', stop_time, 'seconds')

        setMotionSpeed(target_speed, 'fast')

        const timeout_ref = setTimeout(() => {
            setMotionSpeed(0, 'fast')
        }, stop_time * 1000)

        return () => {
            clearTimeout(timeout_ref)
        }

    }, [active_tree_x]);
}