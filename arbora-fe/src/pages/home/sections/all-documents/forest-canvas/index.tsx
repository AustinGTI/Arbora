import {Stage} from "@pixi/react";
import useGlobalHomeState from "../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {Box, Center, VStack} from "@chakra-ui/react";
import React from "react";
import {StandardConsole} from "../../../../../core/helpers/logging.ts";
import GroundRender from "./GroundRender.tsx";
import TreeRender from "../../../../../core/tree-rendering/TreeRender.tsx";
import {TreeData} from "../../../../../core/tree-rendering/types.ts";
import {useDispatch} from "react-redux";
import {setCanvasBoxRect, setHoveredDocumentNote} from "../../../../../core/redux/home/home_slice.ts";
import {GROUND_LEVEL_CONSTANT, TREE_POSITION_PADDING, MAX_CANVAS_WIDTH} from "./constants.ts";
import {
    calculateTreeDimensionsV2, generateRawBranchDataMap
} from "../../../../../core/tree-rendering/helpers/data-utils.ts";
import {generateTreeBranchDataV2} from "../../../../../core/tree-rendering/helpers/data-v2.ts";
import CanvasMotionController from "./motion-control/CanvasMotionController.tsx";
import PiPlainText from "../../../../../pillars-ui/components/text/PiPlainText.tsx";
import useGlobalAuthState from "../../../../../core/redux/auth/hooks/useGlobalAuthState.tsx";
import {capitalCase} from "change-case";

export default function ForestCanvas() {
    const wrapper_box_ref = React.useRef<HTMLDivElement | null>(null);
    const {user} = useGlobalAuthState()

    const {
        documents: {
            documents,
            hovered_document_note,
        },
        all_documents_view: {
            canvas_box_rect,
            canvas_interactive
        }
    } = useGlobalHomeState();
    const dispatch = useDispatch()


    // the ground level as a y coordinate in the canvas
    const ground_level: number = React.useMemo(() => {
        return canvas_box_rect ? canvas_box_rect.window_height * GROUND_LEVEL_CONSTANT : 0
    }, [canvas_box_rect]);

    const trees: TreeData[] = React.useMemo(() => {
        let curr_x = 200
        return documents.map((document) => {
            const tree_data = generateTreeBranchDataV2(document.id, generateRawBranchDataMap(document))
            const tree_dimensions = calculateTreeDimensionsV2(tree_data)
            // const tree_dimensions = {width: 500,height: 500}
            curr_x += tree_dimensions.width / 2 + TREE_POSITION_PADDING
            const data = {
                root_branches: tree_data,
                position: {x: curr_x, y: ground_level},
                document, dimensions: tree_dimensions
            }
            StandardConsole.log('Tree data for ', document.title, data)
            curr_x += tree_dimensions.width / 2 + TREE_POSITION_PADDING
            return data
        });
    }, [documents, ground_level]);

    React.useEffect(() => {
        if (!wrapper_box_ref.current) {
            return
        }

        const canvas_width = Math.min((trees.slice(-1)[0]?.position.x ?? 0) + (trees.slice(-1)[0]?.dimensions.width ?? 0), MAX_CANVAS_WIDTH)

        dispatch(setCanvasBoxRect({
            canvas_width: Math.max(canvas_width, wrapper_box_ref.current.clientWidth),
            window_width: wrapper_box_ref.current.clientWidth,
            window_height: wrapper_box_ref.current.clientHeight
        }))
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const elem = entry.target;
                if (elem instanceof HTMLElement) {
                    dispatch(setCanvasBoxRect({
                        canvas_width: Math.max(canvas_width, elem.clientWidth),
                        window_width: elem.clientWidth,
                        window_height: elem.clientHeight
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

    StandardConsole.log('canvas box rect is ', canvas_box_rect)

    return (
        <React.Fragment>
            <Box
                id={'forest-canvas-box'}
                className={'hidden-scrollbar'}
                position={'absolute'}
                transition={'opacity 0.5s'}
                top={0} left={0} opacity={0}
                ref={wrapper_box_ref} w={'100%'} h={'100%'} overflowX={'scroll'} overflowY={'hidden'}>
                {!documents.length && (
                    <Center position={'absolute'} top={0} left={0} w={'100%'} h={'100%'}>
                        <VStack w={'100%'} h={'100%'} justify={'center'}>
                            <PiPlainText value={`Hi ${capitalCase(user?.name ?? 'Stranger')}!`} fontSize={'40px'}/>
                            <PiPlainText value={'Welcome to Arbora'} fontSize={'50px'}/>
                            <PiPlainText value={'Create a document on the right to start -->'} fontSize={'30px'}/>
                        </VStack>
                    </Center>
                )}
                {canvas_box_rect ? (
                    <Stage width={canvas_box_rect.canvas_width} height={canvas_box_rect.window_height} options={{
                        background: '#efe',
                        antialias: true,
                    }}>
                        <CanvasMotionController tree_data={trees} canvas_box_rect={canvas_box_rect}>
                            {trees.map((tree_data) => {
                                return (
                                    <TreeRender
                                        key={tree_data.document.id}
                                        tree_data={tree_data}
                                        is_interactive={canvas_interactive}
                                        hovered_document_note_id={hovered_document_note}
                                        setHoveredDocumentNoteId={(document_note_id) => {
                                            dispatch(setHoveredDocumentNote(document_note_id))
                                        }}
                                    />
                                );
                            })}
                            <GroundRender rect={{
                                x: 0,
                                y: ground_level,
                                width: canvas_box_rect.canvas_width,
                                height: canvas_box_rect.window_height - ground_level
                            }}/>
                        </CanvasMotionController>
                    </Stage>
                ) : null}
            </Box>
        </React.Fragment>
    )
}