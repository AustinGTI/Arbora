import {ARBORA_GREEN, ARBORA_RED} from "../../../../../../../../core/constants/styling.ts";

export function gradeToColor(grade: number): string {
    switch (grade) {
        case 1:
            return ARBORA_RED.loud;
        case 2:
            return '#FFA500';  // Orange
        case 3:
            return 'yellow';  // Light Green
        case 4:
            return '#32CD32';  // Lime Green
        case 5:
            return ARBORA_GREEN.loud;
        default:
            return ARBORA_GREEN.hard;
    }
}