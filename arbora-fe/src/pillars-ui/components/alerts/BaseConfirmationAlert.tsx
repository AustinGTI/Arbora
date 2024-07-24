import React from 'react';
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import {PiButtonVariant} from "../buttons/types.ts";
import PiButton from "../buttons/PiButton.tsx";

interface BaseConfirmationAlertProps {
    message: string
    handleYes: () => void
    handleNo: () => void
}

export default function BaseConfirmationAlert({message, handleYes, handleNo}: BaseConfirmationAlertProps) {
    const {isOpen, onClose, onOpen} = useDisclosure()

    React.useEffect(() => {
        onOpen()
    }, []);

    return (
        // <ChakraProvider theme={CLIENT_THEME}>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent borderRadius="25px">
                <ModalCloseButton size={'lg'}/>
                <ModalBody py={'2rem'} px={'3.5rem'} pb={'1rem'}>
                    <Flex width={'100%'} flexDirection="column" justifyContent="center" alignItems="center">
                        <Text fontWeight="500" fontSize="14px" color={"black.300"} mt={'20px'}
                              textAlign="center">
                            {message}
                        </Text>
                        <Flex width={'100%'} my="30px" justifyContent="space-around" alignItems="center">
                            <PiButton variant={PiButtonVariant.SOLID} icon={IoMdCheckmarkCircleOutline}
                                      onClick={handleYes} label={'Proceed'}/>
                            <PiButton variant={PiButtonVariant.OUTLINE} onClick={handleNo}
                                      label={'Close'}/>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        // </ChakraProvider>
    )
}