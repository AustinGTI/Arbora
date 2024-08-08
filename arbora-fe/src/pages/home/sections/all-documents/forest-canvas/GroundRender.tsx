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

    const drawTree = React.useCallback((g: PixiGraphics) => {
        g.clear()
        g.beginFill(ARBORA_GREEN.hard)
        g.drawRect(rect.x, rect.y, rect.width, rect.height)
    }, [rect])

    return (
        <Graphics draw={drawTree}/>
    )
}