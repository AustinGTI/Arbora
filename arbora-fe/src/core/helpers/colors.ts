// Helper functions
function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function seededRandom(seed: string): () => number {
    let x = 0;
    for (let i = 0; i < seed.length; i++) {
        x += seed.charCodeAt(i);
    }
    return () => {
        x = Math.sin(x) * 10000;
        return x - Math.floor(x);
    };
}

export function calculateInterpolatedColorWithNoise(t: number, color_stops: Array<[string, number]>, seed: string, noise_factor: number = 0.1): string {
    // Ensure t is within [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Find the color stops to interpolate between
    let left_stop = color_stops[0];
    let right_stop = color_stops[color_stops.length - 1];
    for (let i = 0; i < color_stops.length - 1; i++) {
        if (t >= color_stops[i][1] && t <= color_stops[i + 1][1]) {
            left_stop = color_stops[i];
            right_stop = color_stops[i + 1];
            break;
        }
    }

    // Interpolate between the two color stops
    const [left_color, left_t] = left_stop;
    const [right_color, right_t] = right_stop;
    const segmentT = (t - left_t) / (right_t - left_t);

    const left_rgb = hexToRgb(left_color);
    const right_rgb = hexToRgb(right_color);

    const interpolated_color = left_rgb.map((c, i) => lerp(c, right_rgb[i], segmentT));

    // Add deterministic noise
    const random = seededRandom(seed);
    const noisy_color = interpolated_color.map(c => {
        const noise = (random() - 0.5) * 2 * noise_factor * 255;
        return Math.max(0, Math.min(255, c + noise));
    });

    // Convert back to hex and return
    return rgbToHex(...noisy_color as [number, number, number]);
}
