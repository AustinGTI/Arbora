import React from 'react';
import {RectProps} from "../../../../../core/types.ts";
import {Graphics} from "@pixi/react";
import {Graphics as PixiGraphics} from "@pixi/graphics";
import {ARBORA_GREEN} from "../../../../../core/constants/styling.ts";
import {setCanvasLoadingState} from "../../../../../core/redux/home/home_slice.ts";
import {store} from "../../../../../core/redux";
import {StandardConsole} from "../../../../../core/helpers/logging.ts";

interface GroundSpriteProps {
    rect: RectProps
}

export default function GroundRender({rect}: GroundSpriteProps) {
    React.useEffect(() => {
        setTimeout(() => {
            store.dispatch(setCanvasLoadingState(false))
            StandardConsole.log('settings canvas loading state to false')
        }, 1000)
    }, []);

    const drawGround = React.useCallback((g: PixiGraphics) => {
        g.clear()
        g.beginFill(ARBORA_GREEN.hard)
        g.drawRect(rect.x, rect.y, rect.width, rect.height)
        // drawGroundMarkers(g)
    }, [rect])

    // const drawGroundMarkers = React.useCallback((g: PixiGraphics) => {
    //     // draw ground markers every 100 px with the px count/100 as text
    //     g.lineStyle(1, 0x000000, 0.5)
    //     for (let i = 0; i < rect.width; i += 100) {
    //         g.moveTo(i, rect.y)
    //         g.lineTo(i, rect.y + rect.height)
    //         g.beginFill(0x000000)
    //         g.endFill()
    //     }
    // }, [rect.width, rect.y, rect.height]);

    return (
        <Graphics draw={drawGround}/>
    )
}