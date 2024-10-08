import React from "react";
import {Flex, FormControl, FormControlProps, VStack} from "@chakra-ui/react";
import PiInputLabel from "./PiInputLabel.tsx";
import PiInputError from "./PiInputError.tsx";
import {InputType} from "../types";
import PiInputDescription from "./PiInputDescription.tsx";

export interface PiInputContainerProps extends FormControlProps {
    name: string;
    description?: string;
    label?: string;
    info?: string
    error?: string;
    label_position?: "top" | "left" | "right" | "bottom";
    label_alignment?: "left" | "right" | 'center';
    children: React.ReactNode;
}

interface ConditionalInputContainerProps extends Partial<PiInputContainerProps> {
    in_input_container?: boolean;
    input_type?: InputType;
}

export default function PiInputContainer({
                                             name,
                                             description, info, label,
                                             error,
                                             label_position = "top",
                                             label_alignment = "left",
                                             children,
                                             ...form_control_props
                                         }: PiInputContainerProps) {
    return (
        <FormControl {...form_control_props}>
            <VStack
                w={"100%"}
                py={".5rem"}>
                <Flex w={"100%"} flexDirection={
                    (label_position === "left" || label_position === "right") ? "row" : "column"
                }
                      alignItems={"center"}>
                    {(label && (label_position === "top" || label_position === "left")) && (
                        <PiInputLabel name={name} label={label} info={info}
                                      container_props={{
                                          justify: label_alignment === "center" ? "center" : label_alignment === 'left' ? "flex-start" : "flex-end",
                                      }}
                                      {...(label_position === "top" ? {mb: "0.5rem"} : {m: 0})}
                        />
                    )}
                    {description && (
                        <PiInputDescription description={description}/>
                    )}
                    {children}
                    {(label && (label_position === "bottom" || label_position === "right")) && (
                        <PiInputLabel name={name} label={label} info={info}
                                      container_props={{
                                          justify: label_alignment === "center" ? "center" : label_alignment === 'left' ? "flex-start" : "flex-end",
                                      }}
                                      {...(label_position === "bottom" ? {mb: "0.5rem"} : {m: 0})}
                        />
                    )}
                </Flex>
                {(error) && (
                    <PiInputError error={error}/>
                )}
            </VStack>
        </FormControl>
    );

}

export function ConditionalInputContainer({
                                              input_type = 'form',
                                              in_input_container = true,
                                              name,
                                              label,
                                              children,
                                              ...props
                                          }: ConditionalInputContainerProps) {
    if (in_input_container && input_type !== 'generic' && name && label) {
        return (
            <PiInputContainer name={name} label={label} {...props}>
                {children}
            </PiInputContainer>
        )
    }
    return (<> {children} </>)

}