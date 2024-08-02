import {Box, BoxProps, HStack} from "@chakra-ui/react";
import {Document} from "../../../../core/services/documents/types.ts";
import PiPlainText from "../../../../pillars-ui/components/text/PiPlainText.tsx";
import useGlobalHomeState from "../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {useDispatch} from "react-redux";
import {setActiveDocument} from "../../../../core/redux/home/home_slice.ts";

interface AllDocumentsSectionProps extends BoxProps {
}


interface DocumentPaneProps {
    document: Document
}

function DocumentPane({document}: DocumentPaneProps) {
    const {documents: {active_document}} = useGlobalHomeState()
    const dispatch = useDispatch()

    return (
        <HStack
            cursor={'pointer'}
            w={'calc(100% - 2rem)'} borderRadius={'10px'} p={'2rem'} m={'1rem'}
            bg={active_document?.id === document.id ? 'green.300' : 'green.500'}
            _hover={{bg: 'green'}}
            onClick={() => {
                dispatch(setActiveDocument(document))
            }}>
            <PiPlainText value={document.title} fontWeight={700} fontSize={'20px'}/>
        </HStack>

    )
}

export default function AllDocumentsSection(box_props: AllDocumentsSectionProps) {
    const {documents: {documents}} = useGlobalHomeState()

    return (
        <Box
            bg={'rgba(0, 0, 255, 0.2)'}
            {...box_props}>
            {documents.map((document) => (
                <DocumentPane key={document.id} document={document}/>
            ))}
        </Box>
    )
}