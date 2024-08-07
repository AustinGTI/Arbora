import {VStack} from "@chakra-ui/react";
import ExplainTabChatSection from "./chat";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import ArboraNoDataGraphic from "../../../../../../core/graphics/ArboraNoDataGraphic.tsx";

export default function DocumentViewExplainTab() {
    const {documents: {active_document}} = useGlobalHomeState()

    return (
        <VStack w={'100%'} h={'100%'} px={'1rem'}>
            {active_document ? (
                <ExplainTabChatSection w={'100%'} h={'100%'}/>
            ) : (
                <ArboraNoDataGraphic text={'Select a document to explain it to Arby.'}/>
            )}
        </VStack>
    )
}