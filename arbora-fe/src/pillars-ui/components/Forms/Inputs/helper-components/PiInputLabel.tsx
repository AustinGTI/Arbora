import {FormLabel, FormLabelProps, HStack, StackProps} from "@chakra-ui/react";
import {RiQuestionLine} from "react-icons/ri";
import {PiButtonVariant} from "../../../buttons/types.ts";
import PiButton from "../../../buttons/PiButton.tsx";

interface PiInputLabelProps extends FormLabelProps {
    name: string;
    label: string;
    info?: string;
    container_props?: StackProps
}

export default function PiInputLabel({name, label, info,container_props, ...label_props}: PiInputLabelProps) {
    return (
        <HStack w={"100%"} {...container_props}>
            <FormLabel
                htmlFor={name}
                fontSize={"13px"}
                fontWeight={700}
                textTransform={"capitalize"} {...label_props}>{label}</FormLabel>
            {info && (
                <PiButton
                    variant={PiButtonVariant.GHOST}
                    icon={RiQuestionLine}
                    with_tooltip
                    tooltip_label={info}
                    isDisabled/>
            )}
        </HStack>
    );
}