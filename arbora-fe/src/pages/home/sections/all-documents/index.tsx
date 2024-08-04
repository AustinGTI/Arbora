import {Box, BoxProps} from "@chakra-ui/react";
import ForestCanvas from "./forest-canvas";

interface AllDocumentsSectionProps extends BoxProps {
}


export default function AllDocumentsSection(box_props: AllDocumentsSectionProps) {
    return (
        <Box
            position={'relative'}
            bg={'rgba(0, 0, 255, 0.2)'}
            {...box_props}>
            <ForestCanvas/>
        </Box>
    )
}