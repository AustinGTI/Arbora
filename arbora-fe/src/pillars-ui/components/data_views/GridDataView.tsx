import {Box, BoxProps, HStack} from "@chakra-ui/react";

export interface GridCellData {
    key: string
    color: string
    onClick: () => void
}

interface GridDataViewProps extends BoxProps {
    grid_data: GridCellData[]
    /**
     * default 30
     */
    cell_size?: number
    /**
     * default 5
     */
    cell_border_radius?: number
    /**
     * default 5
     */
    spacing?: number
}

export default function GridDataView
({
     grid_data, cell_size = 30, cell_border_radius = 5, spacing = 5, ...box_props
 }: GridDataViewProps) {
    return (
        <Box {...box_props}>
            <HStack w={'100%'} h={'100%'} flexWrap={'wrap'}>
                {grid_data.map(({key, color, onClick}) => {
                    return (
                        <Box
                            key={key}
                            onClick={onClick}
                            w={`${cell_size}px`} h={`${cell_size}px`}
                            rounded={cell_border_radius} bg={color}/>
                    )
                })}
            </HStack>
        </Box>
    )
}