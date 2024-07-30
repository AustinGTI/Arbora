import React from "react";

interface TimerData {
    t: number
    setTimer: (t: number) => void
}

/**
 * A hook to manage a countdown timer.
 */
export default function useCountdownTimer(): TimerData {
    const [t, setT] = React.useState<number>(0);
    const [interval_id, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);

    const setTimer = React.useCallback((duration: number) => {
        if (interval_id) {
            clearInterval(interval_id);  // Clear existing interval if any
        }
        setT(duration);
        const id = setInterval(() => {
            setT(t => {
                if (t <= 1) {
                    clearInterval(id);
                    return 0;  // Automatically stop the timer at 0
                }
                return t - 1;
            });
        }, 1000);
        setIntervalId(id);
    }, [interval_id, setT, setIntervalId]);

    // Cleanup interval on unmount to prevent memory leaks
    React.useEffect(() => {
        return () => {
            if (interval_id) {
                clearInterval(interval_id);
            }
        };
    }, [interval_id]);

    return {
        t,
        setTimer
    }
}