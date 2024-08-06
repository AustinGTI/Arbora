import {Box, BoxProps} from "@chakra-ui/react";
import ForestCanvas from "./forest-canvas";

interface AllDocumentsSectionProps extends BoxProps {
}


export default function AllDocumentsSection(box_props: AllDocumentsSectionProps) {
    return (
        <Box
            position={'relative'}
            {...box_props}>
            <ForestCanvas/>
        </Box>
    )
}