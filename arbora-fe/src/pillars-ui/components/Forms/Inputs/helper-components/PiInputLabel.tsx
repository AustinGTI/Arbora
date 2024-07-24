import {FormLabel, FormLabelProps, HStack} from "@chakra-ui/react";
import {RiQuestionLine} from "react-icons/ri";
import {PiButtonVariant} from "../../../buttons/types.ts";
import PiButton from "../../../buttons/PiButton.tsx";

interface PiInputLabelProps extends FormLabelProps {
    name: string;
    label: string;
    info?: string;
}

export default function PiInputLabel({name, label, info, ...label_props}: PiInputLabelProps) {
    return (
        <HStack w={"100%"}>
            <FormLabel
                htmlFor={name}
                fontSize={"12px"}
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