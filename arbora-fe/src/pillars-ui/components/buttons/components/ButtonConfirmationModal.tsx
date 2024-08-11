import {
    Box,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    VStack
} from "@chakra-ui/react";
import React from "react";
import PiButton from "../PiButton.tsx";
import {ButtonOnClickFunction, PiButtonVariant} from "../types";
import useModalId, {calculateZIndexAboveModal} from "../../utils/modal-utils/useModalId";
import {BsQuestionCircle} from "react-icons/bs";
import {ARBORA_GREEN} from "../../../../core/constants/styling.ts";

export type ButtonConfirmationModalProps = {
    title: string,
    message: string,
    closeModal: () => void,
    onConfirm: ButtonOnClickFunction,
    onDeny?: ButtonOnClickFunction,
    isOpen: boolean
}

export default function ButtonConfirmationModal({
                                                    message,
                                                    closeModal,
                                                    onConfirm,
                                                    onDeny,
                                                    isOpen
                                                }: ButtonConfirmationModalProps) {
    // a reference to the anchor div which is just a DOM element that anchors the modal
    // to the rest of the DOM by allowing it to generate a modal id
    const anchor_ref = React.useRef<HTMLDivElement | null>(null);

    const modal_id = useModalId(anchor_ref, isOpen)

    const handleYes: ButtonOnClickFunction = React.useCallback((e) => {
        closeModal()
        onConfirm(e)
    }, [closeModal, onConfirm])

    const handleNo: ButtonOnClickFunction = React.useCallback((e) => {
        closeModal()
        onDeny?.(e)
    }, [closeModal, onDeny])

    const modal_z_index: number = React.useMemo(() => {
        return calculateZIndexAboveModal(modal_id)
    }, [modal_id]);

    return (
        <React.Fragment>
            <Box display={'none'} ref={anchor_ref}/>
            <Modal isOpen={isOpen} onClose={closeModal} size="sm" isCentered>
                <ModalOverlay zIndex={modal_z_index}/>
                <div data-modal-id={modal_id} style={{width: '100%', height: '100%'}}>

                    <ModalContent bg={ARBORA_GREEN.bg}
                                  width={'20%'} borderRadius={20}
                                  paddingTop={["1rem", "1rem", "1rem", "1rem"]}
                                  paddingBottom={["1rem", "1rem", "1rem", "1rem"]} px={'1rem'}
                                  containerProps={{zIndex: modal_z_index}}>
                        <ModalCloseButton size={'md'}/>
                        <ModalBody>
                            <VStack width={'100%'} align={"center"}>
                                <Flex
                                    justifyContent="center"
                                    alignItems="center"
                                    h="130px" w="130px" mt={'15px'} mb={'5px'}>
                                    <BsQuestionCircle size="130px" color={ARBORA_GREEN.hard}/>
                                </Flex>
                            </VStack>
                            <Flex width={'100%'} flexDirection="column" justifyContent="center" alignItems="center">
                                <Text fontWeight="500" fontSize="14px" color={"black.300"} mt={'20px'}
                                      textAlign="center">
                                    {message}
                                </Text>
                                <Flex width={'100%'} mt="20px" mb={'15px'} justifyContent="space-around"
                                      alignItems="center">
                                    <PiButton
                                        variant={PiButtonVariant.OUTLINE}
                                        // palette={PiButtonPalette.BLACK_WHITE}
                                        onClick={handleNo}
                                        label={'Close'}/>
                                    <PiButton variant={PiButtonVariant.SOLID}
                                        // palette={PiButtonPalette.BLACK_WHITE}
                                              onClick={handleYes} label={'Yes'}/>
                                </Flex>
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </div>
            </Modal>
        </React.Fragment>
    )
}

