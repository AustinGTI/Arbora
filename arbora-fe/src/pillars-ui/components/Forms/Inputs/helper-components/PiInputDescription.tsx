import {HStack} from "@chakra-ui/react";
import PiPlainText from "../../../text/PiPlainText.tsx";

interface PiInputDescriptionProps {
    description?: string
}

export default function PiInputDescription({description}: PiInputDescriptionProps) {
    return (
        <HStack w={'100%'} py={'0.2rem'}>
            <PiPlainText value={description} color={'gray.500'}/>
        </HStack>
    )
}