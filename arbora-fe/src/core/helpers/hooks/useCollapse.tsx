import React from "react";
import {StandardConsole} from "../logging.ts";

export interface CollapseTimer {
    key: string
    collapse_delay: number
    expand_delay: number
}

export default function useCollapse(collapsed: boolean, timers: CollapseTimer[]) {
    const timeouts = React.useRef<number[]>([]);

    const [collapse_state, setCollapseState] = React.useState<Map<string, boolean>>(() => {
        const state = new Map<string, boolean>()
        timers.forEach(timer => {
            state.set(timer.key, collapsed)
        })
        return state
    })

    StandardConsole.log('collapse state is ',collapse_state)

    // to prevent race conditions, we group the keys with similar delays together so that they are updated at the same time
    const delay_to_keys: Map<string, string[]> = React.useMemo(() => {
        const delay_to_keys = new Map<string, string[]>()
        timers.forEach(timer => {
            [`${timer.collapse_delay}_0`, `${timer.expand_delay}_1`].forEach(delay_key => {
                if (delay_to_keys.has(delay_key)) {
                    delay_to_keys.set(delay_key, [...delay_to_keys.get(delay_key)!, timer.key])
                } else {
                    delay_to_keys.set(delay_key, [timer.key])
                }
            })
        })
        return delay_to_keys
    }, [timers]);

    React.useEffect(() => {
        // when the collapse state changes, set a series of timeouts to update the collapse state of each key
        // first clear all existing timeouts
        timeouts.current.forEach(timeout => {
            clearTimeout(timeout)
        })

        // then set new timeouts
        delay_to_keys.forEach((keys, delay_key) => {
            if (collapsed && delay_key.endsWith('_0') || !collapsed && delay_key.endsWith('_1')) {
                const delay = parseInt(delay_key.split('_')[0])
                const timeout: number = setTimeout(() => {
                    setCollapseState(prev => {
                        const new_state = new Map<string, boolean>(prev)
                        keys.forEach(key => {
                            new_state.set(key, collapsed)
                        })
                        return new_state
                    })
                }, delay) as unknown as number
                timeouts.current.push(timeout)
            }
        })
    }, [collapsed]);

    return collapse_state
}