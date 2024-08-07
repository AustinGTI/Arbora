import React from 'react';
import {Box, BoxProps, HStack, StackProps} from "@chakra-ui/react";

interface EllipsesLoaderProps extends StackProps {
    no_of_ellipses?: number
    /**
     * duration of a single ellipse animation in ms
     */
    animation_duration?: number
    /**
     * props of a single ellipse
     */
    ellipse_props?: BoxProps
    /**
     * the number of ellipses adjacent to the active ellipse that will be colored
     */
    color_spread?: 1
}

/**
 * a function to calculate the opacity of an ellipse given its index, the active ellipse index, number of ellipses and the
 * spread based on its distance to the active ellipse
 */
function calculateEllipseOpacity(i: number, active_i: number, n: number, spread: number): number {
    spread += 1
    const dist = Math.min(Math.abs(i - active_i), (Math.min(i, active_i) + (n - Math.max(i, active_i))))
    return (spread - dist) / spread
}

export default function EllipsesLoader
({
     no_of_ellipses = 5, animation_duration = 200, ellipse_props, ...stack_props
 }: EllipsesLoaderProps) {
    // ensure that number of ellipses is at least 2
    no_of_ellipses = Math.max(2, no_of_ellipses);

    const [active_ellipse, setActiveEllipse] = React.useState<number>(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveEllipse(state => {
                return (state + 1) % no_of_ellipses;
            })
        }, animation_duration)

        return () => clearInterval(interval)
    }, []);

    const active_ellipse_bg_color: string = React.useMemo(() => {
        return (ellipse_props?.bg ?? ellipse_props?.backgroundColor ?? '#afa').toString()
    }, [ellipse_props?.bg, ellipse_props?.backgroundColor]);

    return (
        <HStack {...stack_props}>
            {Array.from({length: no_of_ellipses}, (_, index) => {
                const opacity = calculateEllipseOpacity(index, active_ellipse, no_of_ellipses, 1)
                return (
                    <Box
                        key={index}
                        w={'20px'}
                        h={'20px'}
                        borderRadius={'50%'}
                        transition={`
                        opacity ${animation_duration}ms;
                        `}
                        {...ellipse_props}
                        opacity={opacity}
                        bg={active_ellipse_bg_color}
                    />
                )
            })}
        </HStack>
    )
}