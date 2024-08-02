import {VStack} from "@chakra-ui/react";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";

export default function DocumentViewExplainTab() {
    const {
        documents: {active_document},
        document_view: {
            tab_data: {editor_data: {content}}
        }
    } = useGlobalHomeState()

    return (
        <VStack w={'100%'} h={'100%'} px={'1rem'}>
        </VStack>
    )
}
