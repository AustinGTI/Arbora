import {Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text} from "@chakra-ui/react";
import React from "react";
import PiButton from "../PiButton.tsx";
import {PiButtonVariant} from "../types";
import useModalId, {calculateZIndexAboveModal} from "../../utils/modal-utils/useModalId";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import {BsQuestionCircle} from "react-icons/bs";

export type ButtonConfirmationModalProps = {
    title: string,
    message: string,
    closeModal: () => void,
    onConfirm: () => void,
    onDeny?: () => void,
    isOpen: boolean
}

export default function ButtonConfirmationModal({
                                                    title,
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

    const handleYes = React.useCallback(() => {
        closeModal()
        onConfirm()
    }, [closeModal, onConfirm])

    const handleNo = React.useCallback(() => {
        closeModal()
        if (onDeny) onDeny()
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
                    <ModalContent containerProps={{zIndex: modal_z_index}} borderRadius="25px">
                        <ModalCloseButton size={'lg'}/>
                        <ModalBody py={'2rem'} px={'3.5rem'} pb={'1rem'}>
                            <Flex width={'100%'} justifyContent="center" alignItems="center" my={'35px'}>
                                <Flex justifyContent="center" alignItems="center" h="75px" w="100%"
                                      borderRadius={'50%'}>
                                    <BsQuestionCircle size="75" color={'#FFD380'}/>
                                </Flex>
                            </Flex>
                            <Flex width={'100%'} flexDirection="column" justifyContent="center" alignItems="center">
                                <Text fontWeight="700" fontSize="20px" textAlign="center" color={'black'}>
                                    {title}
                                </Text>
                                <Text fontWeight="500" fontSize="14px" color={"black.300"} mt={'20px'}
                                      textAlign="center">
                                    {message}
                                </Text>
                                <Flex width={'100%'} my="30px" justifyContent="space-around" alignItems="center">
                                    <PiButton variant={PiButtonVariant.SOLID} icon={IoMdCheckmarkCircleOutline}
                                              onClick={handleYes} label={'Yes'}/>
                                    <PiButton variant={PiButtonVariant.OUTLINE} onClick={handleNo}
                                              label={'Close'}/>
                                </Flex>
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </div>
            </Modal>
        </React.Fragment>
    )
}

