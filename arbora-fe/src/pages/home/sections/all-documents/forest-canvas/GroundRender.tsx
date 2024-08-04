import React from 'react';
import {RectProps} from "../../../../../core/types.ts";
import {Graphics} from "@pixi/react";
import {Graphics as PixiGraphics} from "@pixi/graphics";

interface GroundSpriteProps {
    rect: RectProps
}

export default function GroundRender({rect}: GroundSpriteProps) {
    const drawTree = React.useCallback((g: PixiGraphics) => {
        g.clear()
        g.beginFill('#000')
        g.drawRect(rect.x, rect.y, rect.width, rect.height)
    }, [rect])

    return (
        <Graphics draw={drawTree}/>
    )
}