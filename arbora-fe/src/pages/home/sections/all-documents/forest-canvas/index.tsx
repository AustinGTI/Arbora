import {Stage} from "@pixi/react";
import useGlobalHomeState from "../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {Box, Center} from "@chakra-ui/react";
import React from "react";
import PiPlainText from "../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {StandardConsole} from "../../../../../core/helpers/logging.ts";
import {BoxDimensions} from "../../../../../core/types.ts";
import GroundRender from "./GroundRender.tsx";
import TreeRender from "../../../../../core/tree-rendering/TreeRender.tsx";
import {
    calculateTreeDimensions,
    generateRawBranchDataMap,
    generateTreeBranchData
} from "../../../../../core/tree-rendering/helpers/data.ts";
import {TreeData} from "../../../../../core/tree-rendering/types.ts";

const GROUND_LEVEL_CONSTANT = 0.95

export default function ForestCanvas() {
    const wrapper_box_ref = React.useRef<HTMLDivElement | null>(null);

    const {documents: {documents}} = useGlobalHomeState();

    const [canvas_dimensions, setCanvasDimensions] = React.useState<BoxDimensions | null>(null)

    React.useEffect(() => {
        if (!wrapper_box_ref.current) {
            return
        }
        setCanvasDimensions({
            width: wrapper_box_ref.current.clientWidth,
            height: wrapper_box_ref.current.clientHeight
        })

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const elem = entry.target;
                if (elem instanceof HTMLElement) {
                    setCanvasDimensions({
                        width: elem.clientWidth,
                        height: elem.clientHeight
                    })
                } else {
                    StandardConsole.warn('Resize observer target is not an HTMLElement')
                }
            }
        })

        resizeObserver.observe(wrapper_box_ref.current)

    }, [wrapper_box_ref]);

    // the ground level as a y coordinate in the canvas
    const ground_level: number = React.useMemo(() => {
        return canvas_dimensions ? canvas_dimensions.height * GROUND_LEVEL_CONSTANT : 0
    }, [canvas_dimensions]);

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

    return (
        <Box
            className={'hidden-scrollbar'}
            position={'absolute'}
            top={0} left={0}
            ref={wrapper_box_ref} w={'100%'} h={'100%'} overflowX={'scroll'} overflowY={'hidden'}>
            {canvas_dimensions ? (
                <Stage width={2000} height={canvas_dimensions.height} options={{
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
                        x: 0, y: ground_level, width: 2000, height: canvas_dimensions.height - ground_level
                    }}/>
                </Stage>
            ) : (
                <Center w={'100%'} h={'100%'}>
                    <PiPlainText value={'Loading Canvas...'} fontSize={'30px'}/>
                </Center>
            )}
        </Box>
    )
}