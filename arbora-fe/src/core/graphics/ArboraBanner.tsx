import {Text} from "@chakra-ui/react";
import {ARBORA_GREEN} from "../constants/styling.ts";

interface ArboraLogoProps {
    size?: string
}

export default function ArboraBanner({size = '80px'}: ArboraLogoProps) {
    return (
        <Text py={0} my={0}
              fontFamily={'Raleway'} lineHeight={1} fontWeight={100} fontSize={size} color={ARBORA_GREEN.hard}>ARBORA</Text>
    )
}