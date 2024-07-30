import {Box, BoxProps, HStack} from "@chakra-ui/react";
import {Document} from "../../../../core/services/documents/types.ts";
import PiPlainText from "../../../../pillars-ui/components/text/PiPlainText.tsx";
import React from "react";
import {ArboraHomePageContext} from "../../index.tsx";

interface AllDocumentsSectionProps extends BoxProps {
}


interface DocumentPaneProps {
    document: Document
}

function DocumentPane({document}: DocumentPaneProps) {
    const {single_doc_section: {active_document, setActiveDocument}} = React.useContext(ArboraHomePageContext)

    return (
        <HStack
            cursor={'pointer'}
            w={'calc(100% - 2rem)'} borderRadius={'10px'} p={'2rem'} m={'1rem'}
            bg={active_document?.id === document.id ? 'green.300' : 'green.500'}
            _hover={{bg: 'green'}}
            onClick={() => setActiveDocument(document)}>
            <PiPlainText value={document.title} fontWeight={700} fontSize={'20px'}/>
        </HStack>

    )
}

export default function AllDocumentsSection(box_props: AllDocumentsSectionProps) {
    const {all_documents_section: {all_documents}} = React.useContext(ArboraHomePageContext)


    return (
        <Box
            bg={'rgba(0, 0, 255, 0.2)'}
            {...box_props}>
            {all_documents.map((document) => (
                <DocumentPane key={document.id} document={document}/>
            ))}
        </Box>
    )
}