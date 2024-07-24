import React from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    ModalProps,
    useDisclosure
} from "@chakra-ui/react";
import PiButton from "../PiButton.tsx";
import useModalId, {calculateZIndexAboveModal} from "../../utils/modal-utils/useModalId";
import {StandardConsole} from "../../../../core/helpers/logging.ts";
import {GenericButtonProps} from "../types.ts";


export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full"

export type ModalPosition = 'left' | 'right' | 'center'

export type ModalTransition = 'scale' | 'slideInBottom' | 'slideInRight' | 'none'

export type PiModalButtonProps = ({
    /**
     * the content of the modal that will be open when the button is clicked,needs to be a react component
     */
    modal_content: () => React.ReactElement
    /**
     * the size of the modal that will be open when the button is clicked,
     * the options are those from chakra's modal component that is :
     * "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full"
     */
    modal_size?: ModalSize
    /**
     * the props of the modal that will be open when the button is clicked, extends ModalProps of Chakra UI
     */
    modal_props?: Partial<Omit<ModalProps, 'size'>>
    /**
     * the position of the modal that will be open when the button is clicked,
     * by default it is centered
     */
    modal_position?: ModalPosition
    /**
     * the transition that should be used for the modal. the options are those from chakra's modal component that is :
     * "scale" | "slideInBottom" | "slideInRight" | "none"
     */
    modal_transition?: ModalTransition
    /**
     * the function that will be called when the modal is closed
     */
    onCloseModal?: () => void
} & GenericButtonProps)

interface ModalButtonContextProps {
    modal_controls: {
        closeModal: () => void
    }
}

export const ModalButtonContext = React.createContext<ModalButtonContextProps>({
    modal_controls: {
        closeModal: () => {
            StandardConsole.warn("Component not within a PiModalButton or a ModalButtonContext, cannot perform close operation")
        }
    }
})


/**
 * An extension of PiButton that opens a modal when clicked within which the component
 * passed to modal_content prop is rendered
 *
 * the modal_content is wrapped in a ModalButtonContext.Provider so that the
 * a closeModal function is available to the modal_content component and its children
 * @constructor
 */
export default function PiModalButton({
                                        modal_content,
                                        modal_size = 'xl',
                                        modal_position = 'center',
                                        modal_transition = 'none',
                                        modal_props,
                                        onCloseModal,
                                        ...button_props
                                    }: PiModalButtonProps) {
    const button_ref = React.useRef<HTMLButtonElement>(null);

    const {isOpen, onOpen, onClose} = useDisclosure()
    const closeModalHandler = React.useCallback(() => {
        onClose()
        onCloseModal && onCloseModal()
    }, [onClose])

    const modal_id = useModalId(button_ref, isOpen)

    const modal_button_context: ModalButtonContextProps = React.useMemo(() => {
        return {
            modal_controls: {
                closeModal: closeModalHandler
            }
        }
    }, [closeModalHandler]);

    const modal_z_index: number = React.useMemo(() => {
        return calculateZIndexAboveModal(modal_id)
    }, [modal_id]);

    const modal_container_props = React.useMemo(() => {
        switch (modal_position) {
            case 'left':
                return {
                    justifyContent: 'flex-start',
                    paddingLeft: '1rem',
                    zIndex: modal_z_index
                }
            case 'right':
                return {
                    justifyContent: 'flex-end',
                    paddingRight: '1rem',
                    zIndex: modal_z_index
                }
            case 'center':
            default:
                return {
                    justifyContent: 'center',
                    zIndex: modal_z_index
                }
        }
    }, [modal_position, modal_z_index]);


    return (
        <>
            <PiButton ref={button_ref} onClick={onOpen} {...button_props}/>
            <Modal isOpen={isOpen} onClose={closeModalHandler}
                // scrollBehavior={'inside'}
                   size={modal_size}
                   motionPreset={modal_transition}
                   isCentered
                   {...modal_props}>
                <ModalOverlay zIndex={modal_z_index}/>
                <ModalButtonContext.Provider value={modal_button_context}>
                    <div data-modal-id={modal_id} style={{width: '100%', height: '100%'}}>
                        <ModalContent
                            containerProps={modal_container_props}>
                            <ModalCloseButton/>
                            <ModalBody>
                                {React.createElement(modal_content, {closeModal: closeModalHandler})}
                            </ModalBody>
                        </ModalContent>
                    </div>
                </ModalButtonContext.Provider>
            </Modal>
        </>
    )
}