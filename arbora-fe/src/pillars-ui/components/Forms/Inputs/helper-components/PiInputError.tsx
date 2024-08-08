import {HStack, Text, TextProps} from "@chakra-ui/react";

interface PiInputErrorProps extends TextProps {
    error: string
}

export default function PiInputError({error, ...text_props}: PiInputErrorProps) {
    return (
        <HStack w={'100%'} px={'1rem'}>
            <Text
                color={'#FF033E'}
                fontSize={'11px'}
                fontWeight={500}
                lineHeight={'12px'} textAlign={'center'}
                m={0} p={0} {...text_props}>{error}</Text>
        </HStack>
    )
}
