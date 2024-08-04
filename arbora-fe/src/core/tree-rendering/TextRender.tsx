import React from 'react';
import {Document} from "../services/documents/types.ts";
import {useTick} from "@pixi/react";
import {Coords2D} from "../types.ts";
import {Text} from "@pixi/react";
import {TextStyle} from "pixi.js";

interface TextRenderProps {
    position: Coords2D
    document: Document
    note: string
    starting_y_offset?: number
    y_padding?: number
}

export default function TextRender
({
     position, document, note, starting_y_offset = 50, y_padding = 100
 }: TextRenderProps) {
    const [opacity, setOpacity] = React.useState<number>(0)
    const [y_offset, setYOffset] = React.useState<number>(starting_y_offset)

    useTick((delta) => {
        if (opacity < 1) {
            setOpacity(value => {
                return value + 0.02 * delta
            })
        }
        if (y_offset > 0) {
            setYOffset(value => {
                return value - 0.6 * delta
            })
        }
    })

    return (
        <Text
            text={document.notes[note].title.toUpperCase()}
            anchor={0.5}
            x={position.x}
            y={position.y + y_offset - y_padding}
            style={
                new TextStyle({
                    fontFamily: 'Raleway',
                    fontSize: 30,
                    fill: `rgba(15, 25, 15, ${opacity})`,
                    align: 'center',
                })
            }
        />
    )
}