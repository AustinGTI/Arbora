import {IconType} from "react-icons";
import {TbEdit} from "react-icons/tb";
import {MdAdd, MdOutlineDelete, MdSave, MdSettings} from "react-icons/md";
import {FaEye} from "react-icons/fa";
import {FiX} from "react-icons/fi";
import {BsThreeDots} from "react-icons/bs";
import {ButtonPalette, PiButtonIcon, PiButtonPalette, PiButtonVariant} from "./types";
import {ButtonProps} from "@chakra-ui/react";
import chroma from "chroma-js";
import {HiArrowLongLeft, HiArrowLongRight} from "react-icons/hi2";
import {RiDownload2Line, RiUpload2Line} from "react-icons/ri";
import {HiOutlineSwitchHorizontal} from "react-icons/hi";

export function convertIconStringToIconComponent(icon: PiButtonIcon): IconType {
    switch (icon) {
        case PiButtonIcon.ADD:
            return MdAdd
        case PiButtonIcon.EDIT:
            return TbEdit
        case PiButtonIcon.DELETE:
            return MdOutlineDelete
        case PiButtonIcon.VIEW:
            return FaEye
        case PiButtonIcon.SAVE:
            return MdSave
        case PiButtonIcon.CLOSE:
            return FiX
        case PiButtonIcon.OPTIONS:
            return BsThreeDots
        case PiButtonIcon.SETTINGS:
            return MdSettings
        case PiButtonIcon.LONG_LEFT_ARROW:
            return HiArrowLongLeft
        case PiButtonIcon.LONG_RIGHT_ARROW:
            return HiArrowLongRight
        case PiButtonIcon.DOWNLOAD:
            return RiDownload2Line
        case PiButtonIcon.UPLOAD:
            return RiUpload2Line
        case PiButtonIcon.SWAP:
            return HiOutlineSwitchHorizontal

        default:
            throw new Error(`Invalid common icon string: ${icon}`)
    }
}

export function convertPaletteStringToPalette(palette: PiButtonPalette): ButtonPalette {
    switch (palette) {
        case PiButtonPalette.BLACK_WHITE:
            return {
                primary: "black",
                secondary: "white",
                hover: chroma("black").brighten(0.25).hex(),
            }
        case PiButtonPalette.RED_WHITE:
            return {
                primary: "red",
                secondary: "white",
                hover: chroma("red").brighten(0.25).hex(),
            }
        case PiButtonPalette.GREEN_WHITE:
            return {
                primary: "#090",
                secondary: "white",
                hover: chroma("green").brighten(0.25).hex(),
            }
        case PiButtonPalette.GRAY_WHITE:
            return {
                primary: "gray",
                secondary: "white",
                hover: chroma("gray").brighten(0.25).hex(),
            }
        case PiButtonPalette.ORANGE_WHITE:
            return {
                primary: "orange",
                secondary: "white",
                hover: chroma("orange").brighten(0.25).hex(),
            }
        case PiButtonPalette.BLUE_WHITE:
            return {
                primary: "#007AFF",
                secondary: "white",
                hover: chroma("#007AFF").brighten(0.25).hex(),
            }
        case PiButtonPalette.PURE_GREEN:
            return {
                primary: "green.500",
                secondary: "green.100",
                hover: "green.300"
            }
        default:
            throw new Error(`Invalid palette string: ${palette}`)
    }
}


export function variantAndPaletteToStylingProps(variant: PiButtonVariant, palette_string: PiButtonPalette): ButtonProps & {
    icon_size?: string
} {
    const palette = convertPaletteStringToPalette(palette_string);
    switch (variant) {
        // case PiButtonVariant.SOLID:
        //     return {
        //         bg: palette.primary,
        //         color: palette.secondary,
        //         _hover: {
        //             backgroundColor: palette.hover,
        //         },
        //         _active: {
        //             backgroundColor: palette.hover,
        //         }
        //     }
        case PiButtonVariant.SOLID:
            return {
                bg: palette.primary,
                color: palette.secondary,
                _hover: {
                    backgroundColor: palette.hover,
                    borderColor: 'transparent',
                },
                _active: {
                    backgroundColor: palette.hover,
                    borderColor: 'transparent',
                },
                // height: '35px',
                fontSize: '14px',
                borderRadius: '10px',
                py: '20px',
                px: '20px'
            }
        // case PiButtonVariant.OUTLINE:
        //     return {
        //         bg: "transparent",
        //         color: palette.primary,
        //         border: `2px solid ${palette.primary}`,
        //         _hover: {
        //             color: palette.hover,
        //         },
        //         _active: {
        //             color: palette.hover,
        //         }
        //     }
        case PiButtonVariant.OUTLINE:
            return {
                bg: "transparent",
                color: palette.primary,
                borderWidth: '2px',
                borderColor: palette.primary,
                _hover: {
                    color: palette.hover,
                    borderColor: palette.primary,
                },
                _active: {
                    color: palette.hover,
                    borderColor: palette.primary,
                },
                borderRadius: '10px',
                fontSize: '14px',
                height: '35px',
                py: '20px',
                px: '20px'
            }
        case PiButtonVariant.GHOST:
            return {
                bg: "transparent",
                color: palette.primary,
                _hover: {
                    color: palette.hover,
                },
                _active: {
                    color: palette.hover,
                }
            }
        case PiButtonVariant.LINK:
            return {
                bg: "transparent",
                color: palette.primary,
                _hover: {
                    textDecoration: "underline",
                },
                _active: {
                    textDecoration: "underline",
                }
            }
        case PiButtonVariant.TABLE_LINK:
            return {
                bg: "transparent",
                color: palette.primary,
                fontSize: '11px',
                fontWeight: '400',
                whiteSpace: 'unset',
                height: 'auto',
                textAlign: 'left',
                textDecoration: "underline",
                _hover: {
                    textDecoration: "underline"
                },
                _active: {
                    textDecoration: "underline"
                }
            }
        case PiButtonVariant.ICON_CLASSIC:
            return {
                width: '40px',
                height: '30px',
                placeItems: 'center',
                mr: '.5rem',
                bg: 'gray.50',
                border: '1px',
                borderColor: 'gray.300 !important',
                borderRadius: '5px',
                _hover: {bg: 'gray.100'},
                _active: {bg: 'gray.100'},
                color: 'gray.500',
            }
        case PiButtonVariant.ICON:
            return {
                width: '30px',
                height: '30px',
                bg: 'transparent',
                placeItems: 'center',
                _hover: {
                    color: palette.hover + '!important',
                    borderColor: 'transparent',
                },
                _active: {
                    color: palette.hover + ' !important',
                    borderColor: 'transparent',
                },
                _focus: {
                    color: palette.primary,
                    borderColor: 'transparent',
                },
                color: palette.primary,
                icon_size: '30px'
            }

        case PiButtonVariant.SOFT_OUTLINE:
            return {
                bg: "transparent",
                color: chroma(palette.primary).alpha(0.8).hex(),
                borderWidth: '1px',
                borderColor: chroma(palette.primary).alpha(0.3).hex(),
                _hover: {
                    color: chroma(palette.hover).alpha(0.8).hex(),
                    borderColor: chroma(palette.hover).alpha(0.3).hex(),
                },
                _active: {
                    color: chroma(palette.hover).alpha(0.8).hex(),
                    borderColor: chroma(palette.hover).alpha(0.3).hex(),
                }
            }
        default:
            console.warn(`Unknown button variant: ${variant}`)
            return {}
    }
}
