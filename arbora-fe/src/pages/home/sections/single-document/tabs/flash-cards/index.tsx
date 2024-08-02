import {VStack} from "@chakra-ui/react";
import useGlobalHomeState from "../../../../../../core/redux/home/hooks/useGlobalHomeState.tsx";
import PiPlainText from "../../../../../../pillars-ui/components/text/PiPlainText.tsx";

export default function DocumentViewFlashCardsTab() {
    const {
        documents: {active_document, active_note},
        document_view: {
            tab_data: {editor_data: {content}}
        }
    } = useGlobalHomeState()

    return (
        <VStack w={'100%'} h={'100%'} px={'1rem'}>
            <PiPlainText value={`welcome to flashcards, active note is ${active_note}`}/>
        </VStack>
    )
}