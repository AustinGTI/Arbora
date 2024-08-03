import React from 'react'
import {VStack} from "@chakra-ui/react";
import {ButtonActionProps, GenericButtonProps} from "../types";
import PiModalButton, {PiModalButtonProps} from "./PiModalButton.tsx";
import PiDropdownButton, {PiDropdownButtonContext, PiDropdownButtonProps} from "./PiDropdownButton.tsx";
import {PiButtonVariant} from "../types";
import PiButton from "../PiButton.tsx";

export type NestedButtonProps =
    (ButtonActionProps & GenericButtonProps)
    | PiModalButtonProps

export type PiMultiButtonProps = (
    {
        /**
         * the props of the nested buttons that will be rendered in the dropdown, these can be either
         * the props of a BaseButton for performing an action onclick or the props of a ModalButton for opening
         * a modal or the props of a FormModalButton for opening a modal with a form
         */
        nested_buttons_props: NestedButtonProps[]
        /**
         * if a non-modal nested button is clicked, the dropdown will close after the button's action is performed
         * this is by default set to true
         */
        close_on_click?: boolean
    } & Omit<PiDropdownButtonProps, 'dropdown_content'>
    )

/**
 * type guard for checking if the props are for a ModalButton
 * @param props
 */
function isModalButtonProps(props: NestedButtonProps): props is PiModalButtonProps {
    return (props as PiModalButtonProps).modal_content !== undefined
}

interface MultiButtonDropdownContentProps {
    nested_buttons_props: NestedButtonProps[]
    close_on_click: boolean
}

function MultiButtonDropdownContent({nested_buttons_props, close_on_click}: MultiButtonDropdownContentProps) {
    const {dropdown_controls: {closeDropdown}} = React.useContext(PiDropdownButtonContext)

    return (
        <VStack w={'100%'} h={'100%'}>
            {nested_buttons_props.map((button_props, index) => {
                // if there is modal_content, then the button is a ModalButton
                if (isModalButtonProps(button_props)) {
                    return (
                        <PiModalButton key={index} {...button_props} w={'100%'}
                                       onCloseModal={() => {
                                           button_props.onCloseModal && button_props.onCloseModal()
                                           closeDropdown()
                                       }}
                                       variant={PiButtonVariant.GHOST} borderRadius={0}
                                       justifyContent={'flex-start'}/>
                    )
                } else {
                    return (
                        <PiButton key={index} {...button_props}
                                  onClick={(e) => {
                                      button_props.onClick && button_props.onClick(e)
                                      if (close_on_click) {
                                          closeDropdown()
                                      }
                                  }} w={'100%'}
                                  variant={PiButtonVariant.GHOST} borderRadius={0}
                                  justifyContent={'flex-start'}/>
                    )
                }
            })}
        </VStack>
    )
}


/**
 * A button that extends DropdownButton and acts as the nest for a series of other buttons, when clicked it opens a dropdown with the nested buttons in
 * the form of a vertical stack,
 * the nested buttons are rendered based on the props passed to the nested_buttons_props prop,
 * there are 3 types of nested buttons that can be rendered:
 *
 * 1. BaseButton: these are normal buttons as defined in BaseButton
 * 2. ModalButton: these are buttons that open a modal when clicked, the modal is rendered using the modal_content prop as defined in ModalButton
 *
 * their styling will be cloned and some styling will be applied to them
 * to standardize their appearance
 * @constructor
 */
export default function PiMultiButton({
                                          nested_buttons_props,
                                          dropdown_container_props,
                                          close_on_click = true,
                                          ...button_props
                                      }: PiMultiButtonProps) {

    const dropdown_content = React.useMemo(() => {
        return <MultiButtonDropdownContent nested_buttons_props={nested_buttons_props} close_on_click={close_on_click}/>
    }, [nested_buttons_props, close_on_click])

    return (
        <PiDropdownButton
            dropdown_container_props={{
                padding: '.5rem 0',
                minW: '180px',
                ...dropdown_container_props
            }}
            dropdown_content={dropdown_content} {...button_props}/>
    )

}