import React from 'react'


interface BareDOMRect extends Omit<DOMRect, 'toJSON'> {

}

interface BoxProperties {
    ref: React.RefObject<HTMLDivElement>
    box_rect: BareDOMRect
}

export default function useBoxDimensions(): BoxProperties {
    const ref = React.useRef<HTMLDivElement>(null)
    const [box_rect, setBoxRect] = React.useState<BareDOMRect>({
        height: 0, width: 0, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0
    })

    React.useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setBoxRect(ref.current.getBoundingClientRect())
            }
        }

        const resize_observer = new ResizeObserver(handleResize)

        if (ref.current) {
            resize_observer.observe(ref.current)
        }

        // handleResize()
        // window.addEventListener('resize', handleResize)
        return () => {
            // window.removeEventListener('resize', handleResize)
            if (ref.current) {
                resize_observer.unobserve(ref.current)
            }
        }
    }, [ref])

    return {ref, box_rect}
}
