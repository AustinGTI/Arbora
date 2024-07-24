import React from 'react'
import {
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
        // <ChakraProvider theme={CLIENT_THEME}>
        <Modal isOpen={isOpen} onClose={onCloseWithCallback} isCentered>
            <ModalOverlay/>
            <ModalContent bg={'white'}
                          width={{base: "60%", sm: "50%", md: "35%", lg: "30%", xl: "25%"}} borderRadius={20}
                          paddingTop={["1rem", "1rem", "1rem", "1rem"]}
                          paddingBottom={["2rem", "2rem", "2rem", "2rem"]} px={'1rem'}>

                <ModalCloseButton size={'sm'}/>
                <ModalBody>
                    <VStack align={'center'} w={'100%'}>
                        <Flex width={'130px'} height={'150px'} justify="center" align="center" my={'10px'}>
                            <img src={icon} alt="icon"/>
                        </Flex>
                        <Flex width={'100%'} flexDirection="column" justifyContent="center" alignItems="center"
                              mt={"1.75rem"} mb={".5rem"} textAlign={"center"} padding={"10px 30px"}>
                            <Text fontSize={["16px", "16px", "21px", "21px"]}
                                  fontWeight={"700"}
                                  color={"#000000"}
                                  lineHeight={"28px"}
                                  mb={"1.5rem"}
                            >
                                {title}
                            </Text>
                            <Text
                                fontSize={["9px", "9px", "12px", "12px"]}
                                fontWeight={500}
                                color={"#777777"}
                                lineHeight={"18px"}
                                mb={"1.5rem"}>
                                {message.split('\n').filter(line => line.length).map((line, index) => {
                                    return <span style={{padding: 0, margin: 0}} key={index}>{line}<br/></span>
                                })}
                            </Text>
                        </Flex>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
        // </ChakraProvider>
    )
}