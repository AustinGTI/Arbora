import {Box, Image} from "@chakra-ui/react";
import ArboraLogoImage from '../../assets/ArboraLogoV1.png'

interface ArboraLogoProps {
    size: string
}

export default function ArboraLogo({size}: ArboraLogoProps) {
    return (
        <Image src={ArboraLogoImage} alt={'Arbora logo'} w={size} h={size}/>
    )
}