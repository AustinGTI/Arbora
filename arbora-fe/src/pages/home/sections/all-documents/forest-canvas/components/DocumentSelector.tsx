import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import {Center, CenterProps, VStack} from "@chakra-ui/react";
import {useDispatch} from "react-redux";
import {Document} from "../../../../../../core/services/documents/types.ts";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";
import {setActiveDocument} from "../../../../../../core/redux/home/home_slice.ts";


interface DocumentPaneProps extends CenterProps {
    document: Document
}

function DocumentPane({document, ...center_props}: DocumentPaneProps) {
    const dispatch = useDispatch()

    return (
        <Center
            _hover={{opacity: 0.7}}
            onClick={() => {
                dispatch(setActiveDocument(document))
            }}
            w={'100%'} h={'100%'} {...center_props}>
            <PiPlainText fontSize={'14px'} fontWeight={600} value={document.title}/>
        </Center>
    )
}

export default function DocumentSelector() {
    const {documents: {documents}} = useGlobalHomeState()

    return (
        <VStack w={'200px'}>
            {documents.map((document) => (
                <DocumentPane key={document.id} document={document}/>
            ))}
        </VStack>
    )
}