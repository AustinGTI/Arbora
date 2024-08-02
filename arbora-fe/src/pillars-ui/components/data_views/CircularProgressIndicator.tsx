import {Box, BoxProps} from "@chakra-ui/react";

interface CircularProgressIndicatorProps extends BoxProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    circleColor?: string;
    progressColor?: string;
    textColor?: string;
}

export default function CircularProgressIndicator
({
     percentage, size = 100, strokeWidth = 8, circleColor = "#e0e0e0",
     progressColor = "#3f51b5", textColor = "#000000", ...box_props
 }: CircularProgressIndicatorProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - percentage) / 100) * circumference;

    return (
        <Box {...box_props}>
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={circleColor}
                        strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={progressColor} strokeWidth={strokeWidth} strokeDasharray={circumference}
                    strokeDashoffset={progress} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text
                    x="50%" y="50%"
                    dominantBaseline="central" textAnchor="middle" fontSize={`${size / 4}px`}
                    fill={textColor}>
                    {`${Math.round(percentage)}%`}
                </text>
            </svg>
        </Box>
    );
};
