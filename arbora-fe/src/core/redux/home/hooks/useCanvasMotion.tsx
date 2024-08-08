import {RectProps} from "../../../types.ts";
import {store} from "../../index.tsx";

interface CanvasData {
    motion: number
    rect: RectProps | null
}

export default function useCanvasMotion(): CanvasData {
    const {all_documents_view: {canvas_motion,canvas_box_rect}} = store.getState().home

    return {
        motion: canvas_motion,
        rect: canvas_box_rect
    }
}