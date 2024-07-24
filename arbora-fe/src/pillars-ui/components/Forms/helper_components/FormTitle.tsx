import {HStack, Text} from "@chakra-ui/react";

interface FormTitleProps {
    title: string
}

export default function FormTitle({title}: FormTitleProps) {
    return (
        <HStack w={'100%'} py={'.5rem'}>
            <Text fontSize={'16px'} fontWeight={700}>{title}</Text>
        </HStack>
    )
}