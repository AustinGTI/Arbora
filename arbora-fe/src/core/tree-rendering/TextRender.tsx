import React from 'react';
import {Document} from "../services/documents/types.ts";
import {Container, useTick} from "@pixi/react";
import {Coords2D} from "../types.ts";
import {Text} from "@pixi/react";
import {TextStyle, Container as PixiContainer} from "pixi.js";
import {recallProbabilityToColor} from "./helpers/color.ts";

interface TextRenderProps {
    position: Coords2D
    document: Document
    note: string
    starting_y_offset?: number
    y_padding?: number
}

const TEXT_Y_OFFSET_SPEED = 1
const OPACITY_SPEED = 0.02

export default function TextRender
({
     position, document, note, starting_y_offset = 20, y_padding = 75
 }: TextRenderProps) {
    const [opacity, setOpacity] = React.useState<number>(0)
    const [y_offset, setYOffset] = React.useState<number>(starting_y_offset)

    useTick((delta) => {
        if (opacity < 1) {
            setOpacity(value => {
                return value + OPACITY_SPEED * delta
            })
        }
        if (y_offset > 0) {
            setYOffset(value => {
                return value - TEXT_Y_OFFSET_SPEED * delta
            })
        }
    })

    const [prob, color]: [string, [number, number, number]] = React.useMemo(() => {
        if (!document.notes[note]) {
            return ['.00', [0, 0, 0]]
        }
        // the probability should be 3 characters, . then 2 decimal values
        const prob = '.' + document.notes[note].recall_probability.toFixed(2).split('.')[1]

        const color = recallProbabilityToColor(document.notes[note].recall_probability, note)
        // convert hex to rgb
        const rgb_color = (color.match(/[A-Za-z0-9]{2}/g) ?? []).map((v) => parseInt(v, 16))
        return [prob, rgb_color.length == 3 ? rgb_color : [0, 0, 0]] as [string, [number, number, number]]
    }, [document.notes, note]);

    const note_container_ref = React.useRef<PixiContainer | null>(null);
    const document_text_container_ref = React.useRef<PixiContainer | null>(null);

    const [document_text_container_width, setDocumentTextContainerWidth] = React.useState<number>(0)
    const [note_text_container_width, setNoteTextContainerWidth] = React.useState<number>(0)

    React.useEffect(() => {
        setDocumentTextContainerWidth(document_text_container_ref.current?.width ?? 0)
        setNoteTextContainerWidth(note_container_ref.current?.width ?? 0)
    }, [document.notes, note]);

    return (
        <React.Fragment>
            <Container
                ref={document_text_container_ref}
                anchor={0.5}
                x={position.x - document_text_container_width / 2}
                y={position.y + y_offset - y_padding - 40}>
                <Text
                    text={document.title.toUpperCase()}
                    style={
                        new TextStyle({
                            fontFamily: 'Raleway',
                            fontSize: 26,
                            fontWeight: '700',
                            fill: 'black',
                            align: 'center',
                        })
                    }
                />
            </Container>
            <Container
                ref={note_container_ref}
                anchor={0.5}
                x={position.x - note_text_container_width/2}
                y={position.y + y_offset - y_padding}>
                <Text
                    text={prob.toString()}
                    style={
                        new TextStyle({
                            fontFamily: 'Raleway',
                            fontSize: 24,
                            fontWeight: '700',
                            fill: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
                            align: 'center',
                        })
                    }
                />
                <Text
                    text={document.notes[note].title.toUpperCase()}
                    x={40}
                    style={
                        new TextStyle({
                            fontFamily: 'Raleway',
                            fontSize: 24,
                            fill: `rgba(15, 25, 15, ${opacity})`,
                            align: 'center',
                        })
                    }
                />
            </Container>
        </React.Fragment>
    )
}