import {Box, BoxProps} from "@chakra-ui/react";
import ForestCanvas from "./forest-canvas";
import DocumentSelector from "./forest-canvas/components/DocumentSelector.tsx";

interface AllDocumentsSectionProps extends BoxProps {
}


export default function AllDocumentsSection(box_props: AllDocumentsSectionProps) {
    return (
        <Box
            position={'relative'}
            {...box_props}>
            <Box zIndex={1000} position={'absolute'} top={0} left={0} p={'0.5rem'} ml={'1rem'} w={'320px'}>
                <DocumentSelector/>
            </Box>
            <ForestCanvas/>
        </Box>
    )
}