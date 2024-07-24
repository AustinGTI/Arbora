export function mergeRefs(refs: any[]) {
    return (value: any) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref) {
                ref.current = value;
            }
        });
    };
}