import {BoxProps, HStack} from "@chakra-ui/react";
import PiButton from "../../../pillars-ui/components/buttons/PiButton.tsx";
import {PiButtonVariant} from "../../../pillars-ui/components/buttons/types.ts";
import {BiBrain} from "react-icons/bi";
import {StandardConsole} from "../../helpers/logging.ts";

interface HeaderAIButtonProps extends BoxProps {
    header_key: string
}

export default function HeaderAIButton({header_key, ...box_props}: HeaderAIButtonProps) {
    return (
        <HStack
            className={'header-ai-btn'}
            {...box_props} px={'1rem'}>
            <PiButton
                icon={BiBrain}
                variant={PiButtonVariant.ICON}
                icon_props={{fontSize: '20px'}}
                onClick={() => {
                    StandardConsole.log('AI Button Clicked: ' + header_key)
                }}
            />
        </HStack>
    )
}