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