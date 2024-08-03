import {VStack} from "@chakra-ui/react";
import ExplainTabChatSection from "./chat";

export default function DocumentViewExplainTab() {
    return (
        <VStack w={'100%'} h={'100%'} px={'1rem'}>
            <ExplainTabChatSection w={'100%'} h={'100%'}/>
        </VStack>
    )
}