import React from 'react';
import {IDLE_TIME_BEFORE_MOTION} from "../constants.ts";

export default function useIsSiteIdle(): boolean {
    const [is_idle, setIsIdle] = React.useState<boolean>(true)

    const last_site_interaction = React.useRef<number>(Date.now() - IDLE_TIME_BEFORE_MOTION * 1000);

    React.useEffect(() => {
        // when there is a click or mouse move in the site, update the last site interaction
        const handleSiteInteraction = () => {
            last_site_interaction.current = Date.now()
            setIsIdle(false)
        }

        document.addEventListener('click', handleSiteInteraction)
        document.addEventListener('mousemove', handleSiteInteraction)

        return () => {
            document.removeEventListener('click', handleSiteInteraction)
            document.removeEventListener('mousemove', handleSiteInteraction)
        }
    }, []);


    React.useEffect(() => {
        // an interval runs every second checking if the last site interaction was more than IDLE_TIME_BEFORE_MOTION seconds ago,
        // if so setIdle to true
        const interval = setInterval(() => {
            // console.log('last interaction was at ', last_site_interaction.current)
            if (Date.now() - IDLE_TIME_BEFORE_MOTION * 1000 > last_site_interaction.current) {
                setIsIdle(true)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, []);


    return is_idle
}