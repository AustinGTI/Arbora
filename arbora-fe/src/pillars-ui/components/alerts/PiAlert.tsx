import React from 'react'
import {
    ChakraProvider,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {ALERT_TYPES, AlertType} from "./types.ts";
import {APP_THEME} from "../../../App.tsx";
import {ARBORA_GREEN} from "../../../core/constants/styling.ts";

export interface PiAlertProps {
    type: AlertType,
    message: string,
    callback?: () => void,
    duration?: number,
}

export default function PiAlert({type, message, callback = () => null, duration = 5}: PiAlertProps) {
    const {
        title, icon,
        // color
    } = ALERT_TYPES[type]

    const {isOpen, onClose, onOpen} = useDisclosure()
    const onCloseWithCallback = React.useCallback(() => {
        onClose()
        if (callback) callback()
    }, [onClose, callback])

    // after delay seconds, hide the alert
    React.useEffect(() => {
        onOpen()
        setTimeout(() => {
            onCloseWithCallback()
        }, duration * 1000)
    }, [duration])


    return (
        <ChakraProvider theme={APP_THEME}>
            <Modal isOpen={isOpen} onClose={onCloseWithCallback} isCentered>
                <ModalOverlay/>
                <ModalContent bg={ARBORA_GREEN.bg}
                              width={'20%'} borderRadius={20}
                              paddingTop={["1rem", "1rem", "1rem", "1rem"]}
                              paddingBottom={["1rem", "1rem", "1rem", "1rem"]} px={'1rem'}>

                    <ModalCloseButton size={'md'}/>
                    <ModalBody>
                        <VStack align={'center'} w={'100%'}>
                            <Flex width={'130px'}
                                  height={'130px'}
                                  justify="center" align="center" mt={'15px'} mb={'5px'}>
                                <img src={icon} alt="icon"/>
                            </Flex>
                            <Flex width={'100%'} flexDirection="column" justifyContent="center" alignItems="center"
                                  mb={".5rem"} textAlign={"center"} padding={"10px 30px"}>
                                <Text fontSize={["16px", "16px", "21px", "21px"]}
                                      fontWeight={"700"}
                                      color={"#000000"}
                                      lineHeight={"28px"}
                                      mb={"0.5rem"}>
                                    {title}
                                </Text>
                                <Text
                                    fontSize={["9px", "9px", "12px", "12px"]}
                                    fontWeight={500}
                                    color={'#333'}
                                    lineHeight={"18px"}
                                    mb={"1rem"}>
                                    {message.split('\n').filter(line => line.length).map((line, index) => {
                                        return <span style={{padding: 0, margin: 0}} key={index}>{line}<br/></span>
                                    })}
                                </Text>
                            </Flex>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    )
}