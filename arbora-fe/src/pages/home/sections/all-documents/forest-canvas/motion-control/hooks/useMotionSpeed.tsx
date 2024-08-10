import React from 'react';
import {MOTION_ACCELERATION, UPDATES_PER_SECOND} from "../constants.ts";

interface MotionSpeedReturn {
    motion_speed: number
    setMotionSpeed: (speed: number) => void
}

export default function useMotionSpeed(): MotionSpeedReturn {
    const [motion_speed, _setMotionSpeed] = React.useState<number>(0)
    const [motion_target, setMotionSpeed] = React.useState<number>(0)

    React.useEffect(() => {
        // when motion target changes, set an interval to change the motion_speed by MOTION_ACCELERATION every second until they match
        if (motion_target === motion_speed) return


        function updateMotionSpeed() {
            _setMotionSpeed(motion => {
                if (Math.abs(motion_target - motion) < MOTION_ACCELERATION / UPDATES_PER_SECOND) {
                    clearInterval(interval_id)
                    return motion_target
                }
                return motion + Math.sign(motion_target - motion) * MOTION_ACCELERATION / UPDATES_PER_SECOND
            })
        }

        updateMotionSpeed()

        const interval_id = setInterval(updateMotionSpeed, 1000 / UPDATES_PER_SECOND)

        return () => {
            clearInterval(interval_id)
        }
    }, [motion_target]);

    console.log('motion is currently', motion_speed, 'motion target is ', motion_target)

    return {
        motion_speed,
        setMotionSpeed
    }
}