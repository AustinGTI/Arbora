import {Center, CenterProps, Icon, IconProps, VStack} from "@chakra-ui/react";
import {FaKiwiBird} from "react-icons/fa";
import PiPlainText, {PiPlainTextProps} from "../../pillars-ui/components/text/PiPlainText.tsx";

interface ArboraNoDataGraphicProps extends CenterProps {
    text: string
    text_props?: PiPlainTextProps
    icon_props?: IconProps
}

export default function ArboraNoDataGraphic({text, icon_props, text_props, ...center_props}: ArboraNoDataGraphicProps) {
    return (
        <Center h={'100%'} w={'100%'} p={'1rem'} {...center_props}>
            <VStack pb={'15%'}>
                <Icon
                    fontSize={'64px'}
                    as={FaKiwiBird}
                    {...icon_props}/>
                <PiPlainText value={text} fontSize={'24px'} fontWeight={600} {...text_props}/>
            </VStack>
        </Center>
    )
}