import {Center, CenterProps, HStack, VStack} from "@chakra-ui/react";
import PiPlainText from "../../../pillars-ui/components/text/PiPlainText.tsx";
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
    index: number
    no_of_trees: number
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

//todo: optimise performance, i think there's a bottleneck
function AnimatedTreeIcon
({
     index, t, icon: Icon = FaTree, size = 30, padding = 5, no_of_trees,
 }: AnimatedTreeIconProps) {
    const relative_t = React.useMemo(() => {
        const start_position = index / (no_of_trees * 3)
        const end_position = (index) / (no_of_trees * 3) + 1 / 3
        return t * (end_position - start_position) + start_position
    }, [t, index, no_of_trees]);

    const [scale, opacity] = React.useMemo(() => {
        const y = relative_t < 1 / 3 || relative_t > 2 / 3 ? 0 : customCurve((relative_t - 1 / 3) / (1 / 3), 0, 1)
        return [y, y]
    }, [relative_t]);

    return (
        <Center
            w={`${size}px`} h={`${size}px`} p={0} m={0}
            transform={'auto'} translateX={`${-(no_of_trees / 3 * 200) + (t * no_of_trees * 100)}%`}
            scale={scale} opacity={opacity}>
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

const CYCLE_DURATION = 3000
const TREE_ICONS: IconType[] = [FaTree, BsTreeFill, PiTreeFill, PiTreeEvergreenFill]

export default function TreeAnimationLoaderV2
({
     text, no_of_trees = 5, tree_size = 40, tree_padding = 5,
     text_size = 24, text_weight = 700, no_of_ellipses = 3,
     ...center_props
 }: TreeAnimationLoaderProps) {
    const [t, setT] = React.useState<number>(0)
    React.useEffect(() => {
        let animationFrameId: number;
        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) % CYCLE_DURATION;
            setT(progress / CYCLE_DURATION);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // const tree_icon: IconType = React.useMemo(() => {
    //     return TREE_ICONS[Math.floor(Math.random() * TREE_ICONS.length)]
    // }, []);

    const tree_icons: IconType[] = React.useMemo(() => {
        // a random list of tree icons (no_of_trees) long
        return Array.from({length: no_of_trees}).map(() => {
            return TREE_ICONS[Math.floor(Math.random() * TREE_ICONS.length)]
        })
    }, [no_of_trees]);

    return (
        <Center h={'100%'} {...center_props}>
            <VStack align={'center'}>
                <HStack spacing={0} overflow={'hidden'}>
                    {Array.from({length: no_of_trees}).map((_, index) => {
                        return (
                            <AnimatedTreeIcon
                                key={index} index={index} t={t}
                                icon={tree_icons[index]} size={tree_size}
                                padding={tree_padding} no_of_trees={no_of_trees}/>
                        )
                    })}
                    {Array.from({length: no_of_trees}).map((_, index) => {
                        return (
                            <AnimatedTreeIcon
                                key={index + no_of_trees} index={index + no_of_trees} t={t}
                                icon={tree_icons[index]} size={tree_size}
                                padding={tree_padding} no_of_trees={no_of_trees}/>
                        )
                    })}
                </HStack>
                {text && <AnimatedText t={t} text={text} size={text_size} weight={text_weight}
                                       no_of_ellipses={no_of_ellipses}/>}
            </VStack>
        </Center>
    )
}