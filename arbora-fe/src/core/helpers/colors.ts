/**
 * Calculate a unique color shade based on a unique string.
 * @param uniqueString
 */
export function calculateGreenShade(uniqueString: string): string {
    // Generate a hash from the unique string
    let hash = 0;
    for (let i = 0; i < uniqueString.length; i++) {
        const char = uniqueString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to determine green and blue components
    const green = (Math.abs(hash) % 156) + 100; // 100-255
    const blue = Math.abs(hash) % 100; // 0-99

    // Construct the hex color string
    return `#00${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}

// the default range is deep orange to deep green
const DEFAULT_RANGE: [[number, number, number], [number, number, number]] = [
    [255, 87, 34],
    [76, 175, 80]
]

export function uniqueColor(unit_interval: number, unique_string: string, range: [[number, number, number], [number, number, number]] = DEFAULT_RANGE): string {
    // Ensure value is between 0 and 1
    unit_interval = Math.max(0, Math.min(1, unit_interval));

    const [start_color, end_color] = range

    // Interpolate between start and end colors
    const r = start_color[0] + (end_color[0] - start_color[0]) * unit_interval;
    const g = start_color[1] + (end_color[1] - start_color[1]) * unit_interval;
    const b = start_color[2] + (end_color[2] - start_color[2]) * unit_interval;

    // Generate deterministic noise from the unique string
    let hash = 0;
    for (let i = 0; i < unique_string.length; i++) {
        const char = unique_string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to generate noise for each color channel
    const noise_scale = 25; // Adjust this value to control noise intensity
    const r_noise = ((hash & 0xFF) - 128) * noise_scale / 255;
    const g_noise = (((hash >> 8) & 0xFF) - 128) * noise_scale / 255;
    const b_noise = (((hash >> 16) & 0xFF) - 128) * noise_scale / 255;

    // Apply noise to the color and ensure values are within 0-255 range
    const final_r = Math.max(0, Math.min(255, Math.round(r + r_noise)));
    const final_g = Math.max(0, Math.min(255, Math.round(g + g_noise)));
    const final_b = Math.max(0, Math.min(255, Math.round(b + b_noise)));

    // Construct the hex color string
    return `#${final_r.toString(16).padStart(2, '0')}${final_g.toString(16).padStart(2, '0')}${final_b.toString(16).padStart(2, '0')}`;
}

// console.log('unique color test')
// console.log(uniqueColor(0.5, 'test'))
// console.log(uniqueColor(0.5, 'test', [[255, 0, 0], [0, 255, 0]]))