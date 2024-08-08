import {Box, BoxProps, HStack} from "@chakra-ui/react";
import React from "react";

export interface GridCellData {
    key: string
    color: string
    content?: React.ReactNode
    onClick: () => void
}

interface GridDataViewProps extends BoxProps {
    grid_data: GridCellData[]
    /**
     * default 5
     */
    spacing?: number
    /**
     * by default is 5, if this is set, do not set the cell width in the cell_props,
     * it is manipulated by this prop to ensure a perfect fit
     */
    cells_per_row?: number
    cell_props?: BoxProps
}

export default function GridDataView
({
     grid_data, cell_props, spacing = 5, cells_per_row = 5, ...box_props
 }: GridDataViewProps) {
    const default_cell_size = React.useMemo(() => {
        return `calc(calc(100% - ${spacing * (cells_per_row - 1)}px) / ${cells_per_row})`
    }, [spacing, cells_per_row]);

    return (
        <Box {...box_props}>
            <HStack w={'100%'} h={'100%'} flexWrap={'wrap'} spacing={`${spacing}px`}>
                {grid_data.map(({key, color, content, onClick}) => {
                    return (
                        <Box
                            key={key}
                            onClick={onClick}
                            w={default_cell_size} aspectRatio={1}
                            rounded={'7px'} bg={color}
                            {...cell_props}>
                            {content}
                        </Box>
                    )
                })}
            </HStack>
        </Box>
    )
}