export function seededRandom(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Normalize the hash to a value between 0 and 1
    return (hash & 0x7FFFFFFF) / 0x7FFFFFFF;
}
