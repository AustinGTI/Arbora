import React from 'react';
import {RectProps} from "../../../../../core/types.ts";
import {Graphics} from "@pixi/react";
import {Graphics as PixiGraphics} from "@pixi/graphics";
import {ARBORA_GREEN} from "../../../../../core/constants/styling.ts";

interface GroundSpriteProps {
    rect: RectProps
}

export default function GroundRender({rect}: GroundSpriteProps) {
    const drawTree = React.useCallback((g: PixiGraphics) => {
        g.clear()
        g.beginFill(ARBORA_GREEN.hard)
        g.drawRect(rect.x, rect.y, rect.width, rect.height)
    }, [rect])

    return (
        <Graphics draw={drawTree}/>
    )
}