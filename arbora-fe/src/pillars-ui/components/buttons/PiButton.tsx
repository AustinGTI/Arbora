import React from "react";
import {Button, ButtonProps, Icon, Tooltip, useDisclosure} from "@chakra-ui/react";
import {ButtonActionProps, GenericButtonProps, PiButtonPalette, PiButtonVariant} from "./types.ts";
import ButtonConfirmationModal from "./components/ButtonConfirmationModal.tsx";
import {convertIconStringToIconComponent, variantAndPaletteToStylingProps} from "./helpers.ts";
import {StandardConsole} from "../../../core/helpers/logging.ts";


export type PiButtonProps = ButtonActionProps & GenericButtonProps

/**
 * The primary button component that serves as the foundation for all other button components in this codebase
 * The button is an extension of the Chakra UI Button component and extends all its props while adding some of its own
 * for further specificity and control with regards to the site's design system
 */
const PiButton = React.forwardRef<HTMLButtonElement, PiButtonProps>
(function PiButton({
                       label,
                       icon,
                       children,
                       onClick = () => {
                       },

                       variant = label ? PiButtonVariant.SOLID : PiButtonVariant.ICON,
                       palette = PiButtonPalette.PURE_GREEN,
                       icon_position = "left",
                       icon_props,

                       with_tooltip = false,
                       tooltip_label = "",
                       tooltip_placement = "bottom",

                       with_confirmation = false,
                       confirmation_title = "",
                       confirmation_message = "",

                       ...button_props
                   }: PiButtonProps, ref) {
    const local_button_ref = React.useRef<HTMLButtonElement>(null);


    // there has to be either a text, icon or children
    if (!label && !icon && !children) {
        throw new Error("PiButton requires either a text, icon or children");
    }

    const [is_loading, setLoadingState] = React.useState<boolean>(false);
    const default_button_props: ButtonProps = React.useMemo(() => ({
        size: "sm",
        fontSize: "xs",
        borderRadius: "3px",
        textTransform: "capitalize",
        gap: "0.4em"
    }), []);

    const {icon_size, ...button_styling_props} = React.useMemo(() => {
        return variantAndPaletteToStylingProps(variant, palette)
    }, [variant, palette]);

    const {isOpen, onClose, onOpen} = useDisclosure();


    return (
        <>
            <Tooltip isDisabled={!with_tooltip} label={tooltip_label} placement={tooltip_placement}>
                <Button
                    ref={ref ? ref : local_button_ref}
                    {...default_button_props}
                    {...button_styling_props}
                    // when the content is 'children' the height of the button should be auto
                    // so that it can accommodate the children
                    h={children ? "auto" : undefined}
                    {...button_props}
                    onClick={
                        with_confirmation ?
                            onOpen :
                            async (e) => {
                                // if the button is loading, then the onClick function should not be called
                                // this is to prevent the user from clicking the button multiple times
                                if (is_loading || button_props.isLoading) {
                                    return;
                                }
                                setLoadingState(true)
                                StandardConsole.log('set to is loading')
                                await onClick?.(e)
                                StandardConsole.log('set to not loading')
                                setLoadingState(false)
                            }
                    }
                    isLoading={is_loading || button_props.isLoading}>
                    {children ? children :
                        <React.Fragment>
                            {icon_position === "left" && icon ? (
                                <Icon data-testid={"icon-left"}
                                      fontSize={icon_size}
                                      as={typeof icon === 'string' ? convertIconStringToIconComponent(icon) : icon} {...icon_props}/>
                            ) : undefined}
                            {label}
                            {icon_position === "right" && icon ? (
                                <Icon data-testid={"icon-right"}
                                      fontSize={icon_size}
                                      as={typeof icon === 'string' ? convertIconStringToIconComponent(icon) : icon} {...icon_props}/>
                            ) : undefined}
                        </React.Fragment>
                    }
                </Button>
            </Tooltip>
            <ButtonConfirmationModal title={confirmation_title} message={confirmation_message}
                                     closeModal={onClose}
                                     onConfirm={(e) => onClick(e)} isOpen={isOpen}/>
        </>
    );
})

export default PiButton;