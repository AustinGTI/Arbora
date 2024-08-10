import React from 'react';

/**
 * by default the canvas should be scrollable horizontally, this hook
 * adds the necessary event listeners to make it scrollable horizontally
 */
export default function useScrollHorizontally(): null {

    React.useEffect(() => {
        const canvas_box = document.querySelector('#forest-canvas-box') as HTMLDivElement

        if (!canvas_box) return

        function verticalScrollToHorizontal(e: WheelEvent) {
            e.preventDefault()
            canvas_box!.scrollLeft += (e.deltaY + e.deltaX) * 5
        }

        canvas_box.addEventListener('wheel', verticalScrollToHorizontal)

        return () => {
            canvas_box.removeEventListener('wheel', verticalScrollToHorizontal)
        }
    }, []);

    return null
}