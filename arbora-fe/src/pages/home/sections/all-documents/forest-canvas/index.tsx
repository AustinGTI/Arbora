import {Stage} from "@pixi/react";
import useGlobalHomeState from "../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {Box} from "@chakra-ui/react";
import React from "react";
import {StandardConsole} from "../../../../../core/helpers/logging.ts";
import GroundRender from "./GroundRender.tsx";
import TreeRender from "../../../../../core/tree-rendering/TreeRender.tsx";
import {
    calculateTreeDimensions,
    generateRawBranchDataMap,
    generateTreeBranchData
} from "../../../../../core/tree-rendering/helpers/data.ts";
import {TreeData} from "../../../../../core/tree-rendering/types.ts";
import {useDispatch} from "react-redux";
import {setCanvasBoxRect} from "../../../../../core/redux/home/home_slice.ts";
import {MIN_CANVAS_WIDTH, GROUND_LEVEL_CONSTANT, MAX_CANVAS_WIDTH} from "./constants.ts";
import useMoveToActiveDocument from "./hooks/useMoveToActiveDocument.tsx";

interface SlideControlProps {
    tree_data: TreeData[]
}

function SlideControl({tree_data}: SlideControlProps) {
    useMoveToActiveDocument(tree_data)
    return <></>
}

export default function ForestCanvas() {
    const wrapper_box_ref = React.useRef<HTMLDivElement | null>(null);

    const {documents: {documents}, all_documents_view: {canvas_box_rect}} = useGlobalHomeState();
    const dispatch = useDispatch()


    // the ground level as a y coordinate in the canvas
    const ground_level: number = React.useMemo(() => {
        return canvas_box_rect ? canvas_box_rect.height * GROUND_LEVEL_CONSTANT : 0
    }, [canvas_box_rect]);

    const trees: TreeData[] = React.useMemo(() => {
        let curr_x = 200
        return documents.map((document) => {
            const tree_data = generateTreeBranchData(generateRawBranchDataMap(document))
            const tree_dimensions = calculateTreeDimensions(tree_data)
            curr_x += tree_dimensions.width / 2
            const data = {
                root_branches: tree_data,
                position: {x: curr_x, y: ground_level},
                document, dimensions: tree_dimensions
            }
            StandardConsole.log('Tree data for ', document.title, data)
            curr_x += tree_dimensions.width / 2
            return data
        });
    }, [documents, ground_level]);

    React.useEffect(() => {
        if (!wrapper_box_ref.current) {
            return
        }

        const canvas_width = Math.min(Math.max(trees.slice(-1)[0].position.x + trees.slice(-1)[0].dimensions.width, MIN_CANVAS_WIDTH), MAX_CANVAS_WIDTH)

        dispatch(setCanvasBoxRect({
            x: wrapper_box_ref.current.offsetLeft,
            y: wrapper_box_ref.current.offsetTop,
            width: canvas_width,
            height: wrapper_box_ref.current.clientHeight
        }))
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const elem = entry.target;
                if (elem instanceof HTMLElement) {
                    dispatch(setCanvasBoxRect({
                        x: elem.offsetLeft,
                        y: elem.offsetTop,
                        width: canvas_width,
                        height: elem.clientHeight
                    }))
                } else {
                    StandardConsole.warn('Resize observer target is not an HTMLElement')
                }
            }
        })

        resizeObserver.observe(wrapper_box_ref.current)

    }, [wrapper_box_ref, trees]);


    // on load set the opacity to 1
    React.useEffect(() => {
        if (wrapper_box_ref.current) {
            setTimeout(() => {
                StandardConsole.log('Setting opacity to 1')
                wrapper_box_ref.current!.style.opacity = '1'
            }, 500)
        }
    }, []);

    return (
        <React.Fragment>
            <Box
                className={'hidden-scrollbar forest-canvas-wrapper'}
                position={'absolute'}
                transition={'opacity 0.5s'}
                top={0} left={0} opacity={0}
                ref={wrapper_box_ref} w={'100%'} h={'100%'} overflowX={'scroll'} overflowY={'hidden'}>
                {canvas_box_rect ? (
                    <Stage width={canvas_box_rect.width} height={canvas_box_rect.height} options={{
                        background: '#efe',
                        antialias: true
                    }}>
                        {trees.map((tree_data) => {
                            return (
                                <TreeRender
                                    key={tree_data.document.id}
                                    tree_data={tree_data}/>
                            );
                        })}
                        <GroundRender rect={{
                            x: 0,
                            y: ground_level,
                            width: canvas_box_rect.width,
                            height: canvas_box_rect.height - ground_level
                        }}/>
                        <SlideControl tree_data={trees}/>
                    </Stage>
                ) : null}
            </Box>
        </React.Fragment>
    )
}