import {Center, CenterProps, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../text/PiPlainText.tsx";
import {FaTree} from "react-icons/fa";
import "./loaders.scss"
import {IconType} from "react-icons";
import React from "react";
import {BsTreeFill} from "react-icons/bs";
import {PiTreeEvergreenFill, PiTreeFill} from "react-icons/pi";

interface TreeAnimationLoaderProps extends CenterProps {
    text?: string
    text_size?: number
    text_weight?: number
    no_of_ellipses?: number
    no_of_trees?: number
    tree_size?: number
    tree_padding?: number
}

interface AnimatedTreeIconProps {
    t: number
    start_position: number
    end_position: number
    icon?: IconType
    size?: number
    padding?: number
}

function customCurve(t: number, a: number, b: number): number {
    // Ensure t is between 0 and 1
    t = Math.max(0, Math.min(1, t));

    // Calculate the midpoint and amplitude
    const amp = (b - a) / 2;

    // Create a symmetric curve that peaks at 0.5
    let curve: number;
    if (t <= 0.5) {
        // Rising part
        curve = Math.pow(Math.sin(Math.PI * t), 0.3);
    } else {
        // Falling part
        curve = Math.pow(Math.sin(Math.PI * (1 - t)), 0.3);
    }

    // Adjust the curve to flatten near the peak
    curve = curve * (1 - Math.pow(Math.abs(0.5 - t) * 2, 8));

    // Scale and shift the curve to fit between a and b
    return a + amp * curve * 2;
}

function AnimatedTreeIcon
({
     t, start_position, end_position, icon: Icon = FaTree, size = 30, padding = 5
 }: AnimatedTreeIconProps) {
    const relative_t = React.useMemo(() => {
        return t * (end_position - start_position) + start_position
    }, [t, end_position, start_position]);

    return (
        <Center
            w={`${size}px`} h={`${size}px`} p={0} m={0}
            transform={'auto'} translateX={`${-50 + (t * 100)}%`}
            opacity={customCurve(relative_t, 0, 1)}
            scale={customCurve(relative_t, 0.3, 1)}
        >
            <Icon
                fontSize={`${(size - padding)}px`}/>
        </Center>
    )
}

interface AnimatedTextProps {
    t: number
    text: string
    size: number
    weight: number
    no_of_ellipses?: number
}

function AnimatedText
({
     t, text, size, weight, no_of_ellipses = 3
 }: AnimatedTextProps) {
    return (
        <HStack position={'relative'} spacing={0}>
            <PiPlainText value={text} fontSize={`${size}px`} fontWeight={weight}/>
            <HStack spacing={'1px'} px={'1px'}>
                {Array.from({length: no_of_ellipses}).map((_, index) => {
                    const start_t = (index / no_of_ellipses);
                    const opacity = (t - start_t) / (1 / no_of_ellipses)
                    return (
                        <PiPlainText
                            key={index}
                            value={'.'} opacity={opacity}
                            fontSize={`${size}px`} fontWeight={weight}/>
                    )
                })
                }
            </HStack>
        </HStack>
    )
}

const CYCLE_DURATION = 1000
const FPS = 60
const TREE_ICONS: IconType[] = [FaTree, BsTreeFill, PiTreeFill, PiTreeEvergreenFill]

export default function TreeAnimationLoader
({
     text, no_of_trees = 5, tree_size = 40, tree_padding = 5,
     text_size = 24, text_weight = 700, no_of_ellipses = 3,
     ...center_props
 }: TreeAnimationLoaderProps) {
    const [t, setT] = React.useState<number>(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setT(t => {
                if (t == 1) {
                    return 0
                }
                let nt = t + (1000 / FPS) / CYCLE_DURATION
                if (nt > 1) {
                    nt = 1
                }
                return nt
            })
        }, 1000 / FPS)
        return () => clearInterval(interval)
    }, []);

    const tree_icon: IconType = React.useMemo(() => {
        return TREE_ICONS[Math.floor(Math.random() * TREE_ICONS.length)]
    }, []);

    return (
        <Center h={'100%'} {...center_props}>
            <VStack align={'center'}>
                <HStack spacing={0}>
                    {Array.from({length: no_of_trees}).map((_, index) => {
                        return (
                            <AnimatedTreeIcon
                                key={index} t={t} start_position={index / (no_of_trees)} icon={tree_icon}
                                end_position={(index + 1) / (no_of_trees)} size={tree_size} padding={tree_padding}/>
                        )
                    })}
                </HStack>
                {text && <AnimatedText t={t} text={text} size={text_size} weight={text_weight}
                                       no_of_ellipses={no_of_ellipses}/>}
            </VStack>
        </Center>
    )
}