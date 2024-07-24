import React from 'react'
import {Box, StackProps, VStack} from "@chakra-ui/react";
import {createPortal} from "react-dom";
import {GenericButtonProps} from "../types";
import PiButton from "../PiButton.tsx";
import useModalId from "../../utils/modal-utils/useModalId";
import {isChildOfModal} from "../../utils/modal-utils/helpers";
import {StandardConsole} from "../../../../core/helpers/logging.ts";
import useBoxDimensions from "../../utils/hooks/useBoxDimensions.tsx";
import {PORTAL_BOX_ID} from "../../../index.tsx";


type DropdownAnchor = 'left' | 'right'

export interface DropdownContainerProps extends Omit<StackProps, "width" | "w"> {
    anchor?: DropdownAnchor
    width?: 'match-button' | StackProps['width']
    w?: 'match-button' | StackProps['w']
}

export type ButtonDropdownModalProps = {
    /**
     * the content of the dropdown that will be open when the button is clicked
     * needs to be a react element, it will have access to a PiDropdownButton context with
     * a closeDropdown function that can be used to close the dropdown, this allows the
     * dropdown to be closed from within the dropdown content
     */
    dropdown_content: React.ReactElement

    /**
     * the props of the dropdown that will be open when the button is clicked, these consist
     * of anchor (left,right,center) which determines the position of the dropdown relative to the button as well as
     * StackProps that are passed to the dropdown container itself
     */
    dropdown_container_props?: DropdownContainerProps
    /**
     * a function that is run when the dropdown closes or opens and passes the new state of the dropdown
     */
    onDropdownStateChange?: (is_open: boolean) => void
    /**
     * the anchor of the dropdown, determines the position of the dropdown relative to the button
     * can be left or right, defaults to left
     */
    dropdown_anchor?: DropdownAnchor,
    /**
     * whether the dropdown should be rendered in a portal or not, defaults to true
     * a portal allows the dropdown to be rendered above other elements in the dom and even
     * outside of its parent container even if the parent container has overflow set to hidden or scroll
     */
    render_in_portal?: boolean
}


export type PiDropdownButtonProps = (
    ButtonDropdownModalProps
    & GenericButtonProps
    )

const PORTAL_DROPDOWN_BOX_ID = 'dropdown-box'

interface DropdownButtonContextProps {
    dropdown_controls: {
        closeDropdown: () => void
    }
}

export const PiDropdownButtonContext = React.createContext<DropdownButtonContextProps>({
    dropdown_controls: {
        closeDropdown: () => {
            StandardConsole.warn("Component not within a PiDropdownButton or a PiDropdownButtonContext, cannot close dropdown")
        }
    }
})


/**
 * An extension of PiButton that opens a dropdown when clicked, within which the component passed within dropdown_content is rendered
 * the dropdown can be rendered in a portal or not, if it is rendered in a portal, it will be rendered above other elements in the dom
 * except other modals which is useful in certain instances, otherwise it can be rendered ordinarily with an absolutely positioned <div>
 *
 * The dropdown_content is also wrapped within a PiDropdownButtonContext which provides
 * dropdown_controls specifically a closeDropdown function that can be used to close the dropdown
 * from within the dropdown_content
 *
 * * to make the content match the button in width, set the width or w in dropdown_container_props to 'match-button'
 */
export default function PiDropdownButton({
                                           dropdown_content,
                                           dropdown_container_props,
                                           render_in_portal = true,
                                           dropdown_anchor: anchor = 'left',
                                           onDropdownStateChange,
                                           ...button_props
                                       }: PiDropdownButtonProps) {
    const {
        // anchor,
        width: dropdown_width,
        w: dropdown_w,
        ...dropdown_props_rest
    } = dropdown_container_props ?? {}

    const [isOpen, setIsOpen] = React.useState(false)

    const portal_box = document.getElementById(PORTAL_BOX_ID)

    const [resizes, countResize] = React.useReducer((x) => x + 1, 0)

    const {ref: dropdown_button_ref, box_rect: {width: dropdown_button_width}} = useBoxDimensions()

    const modal_id = useModalId(dropdown_button_ref, isOpen)

    // calculate the position of the dropdown based on the dimensions of the dropdown ref and the position of the portal box
    const position_props = React.useMemo(() => {
        if (render_in_portal) {
            if (dropdown_button_ref.current && portal_box) {
                const dropdown_button_rect = dropdown_button_ref.current.getBoundingClientRect()
                const portal_box_rect = portal_box.getBoundingClientRect()

                const top = `${(dropdown_button_rect.y - portal_box_rect.y) + dropdown_button_rect.height + 10}px !important`
                let props: StackProps;
                switch (anchor) {
                    case 'left':
                    case undefined:
                        props = {
                            left: dropdown_button_rect.x - portal_box_rect.x
                        }
                        break;
                    case 'right':
                        props = {
                            right: -((dropdown_button_rect.x - portal_box_rect.x) + dropdown_button_rect.width)
                        }
                        break;
                    default:
                        props = {
                            left: dropdown_button_rect.x - portal_box_rect.x
                        }
                }
                return {top, ...props}
            }
            return {}
        } else {
            switch (anchor) {
                case 'left':
                case undefined:
                    return {
                        top: 10,
                        left: 0
                    }
                case 'right':
                    return {
                        top: 10,
                        right: 0
                    }
                default:
                    return {
                        left: 0,
                        top: 10,
                    }
            }
        }
    }, [resizes, render_in_portal, dropdown_button_ref.current?.getBoundingClientRect(), portal_box?.getBoundingClientRect()])

    React.useEffect(() => {
        function onClickOutsideDropdown(event: MouseEvent) {
            // if the click is in the dropdown button, do nothing, let it be handled by the button
            if (dropdown_button_ref.current?.contains(event.target as Node)) return
            // if the click is not in the modal or its descendants, close the modal
            if (!isChildOfModal(event.target as HTMLElement, modal_id)) {
                setIsOpen(false)
            }
        }

        function onScrollOutsideDropdown(event: Event) {
            // if the scroll is in the dropdown button, do nothing, let it be handled by the button
            if (dropdown_button_ref.current?.contains(event.target as Node)) return
            // if the scroll is not in the modal or its descendants, close the modal
            if (!isChildOfModal(event.target as HTMLElement, modal_id)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('click', onClickOutsideDropdown, true)
            document.addEventListener('scroll', onScrollOutsideDropdown, true)
        } else {
            document.removeEventListener('click', onClickOutsideDropdown, true)
            document.removeEventListener('scroll', onScrollOutsideDropdown, true)
        }
        return () => {
            document.removeEventListener('click', onClickOutsideDropdown, true)
            document.removeEventListener('scroll', onScrollOutsideDropdown, true)
        }
    }, [modal_id, isOpen])

    React.useEffect(() => {
        onDropdownStateChange?.(isOpen)
    }, [isOpen])

    React.useEffect(() => {
        // use an observer to watch for changes in the window size and reposition the dropdown accordingly
        // * not very necessary but useful for keeping the dropdown in the right position when opening the dev tools dashboard
        const observer = new ResizeObserver(() => {
            countResize()
        })
        observer.observe(window.document.body)
        return () => {
            observer.disconnect()
        }
    }, []);


    const dropdown_button_context: DropdownButtonContextProps = React.useMemo(() => {
        return {
            dropdown_controls: {
                closeDropdown: () => {
                    setIsOpen(false)
                }
            }
        }
    }, [setIsOpen]);


    const actual_dropdown_width = React.useMemo(() => {
        // if the width or w in dropdown props is 'match-button' then set the width to the width of the button else use the width or w provided else fit-content
        if (dropdown_width === 'match-button' || dropdown_w === 'match-button') {
            return dropdown_button_width ?? 'fit-content'
        } else {
            return dropdown_width ?? dropdown_w ?? 'fit-content'
        }
    }, [dropdown_button_width]);


    const dropdown_z_index = React.useMemo(() => {
        // z index is the number of sections in the modal_id * 1000
        // this formula is a good enough approximation to ensure that the dropdown is always above the modal
        const modal_level = modal_id.split('-').length
        return modal_level * 1000
    }, [modal_id]);

    const dropdown_container = React.useMemo(() => {
        return (
            <PiDropdownButtonContext.Provider value={dropdown_button_context}>
                <div style={{width: '100%', height: '100%'}} data-modal-id={modal_id}>
                    <VStack
                        className={'hidden-scrollbar'}
                        id={PORTAL_DROPDOWN_BOX_ID}
                        // zIndex={elevation ?? in_modal ? 999999 : 1000}
                        zIndex={dropdown_z_index}
                        bg={'white'} rounded={'md'}
                        overflowY={'auto'}
                        padding={'1rem'} {...dropdown_props_rest}
                        width={actual_dropdown_width}
                        position={'absolute'}
                        boxShadow={'0 0 5px rgba(0,0,0,0.1)'}
                        {...position_props}>
                        {dropdown_content}
                    </VStack>
                </div>
            </PiDropdownButtonContext.Provider>
        )
    }, [actual_dropdown_width, position_props, dropdown_content, modal_id, dropdown_button_context, dropdown_z_index]);

    return (
        <Box ref={dropdown_button_ref} h={button_props.h ?? button_props.height ?? 'fit-content'}
             w={button_props.w ?? button_props.width ?? 'fit-content'} position={'relative'} overflow={'visible'}
             marginInlineStart={'0 !important'}>
            <PiButton onClick={() => {
                setIsOpen(!isOpen)
            }} {...button_props}/>
            {isOpen && (render_in_portal ? createPortal(
                dropdown_container, portal_box as HTMLDivElement ?? document.body
            ) : dropdown_container)}
        </Box>
    )
}
