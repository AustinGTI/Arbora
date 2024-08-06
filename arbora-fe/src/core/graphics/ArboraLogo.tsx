import {FaTree} from "react-icons/fa";
import {ARBORA_GREEN} from "../constants/styling.ts";

interface ArboraLogoProps {
    size: string
}

export default function ArboraLogo({size}: ArboraLogoProps) {
    return (
        // <Image src={ArboraLogoImage} alt={'Arbora logo'} w={size} h={size}/>
        <FaTree color={ARBORA_GREEN.hard} fontSize={size}/>
    )
}