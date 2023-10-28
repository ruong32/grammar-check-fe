import { useEffect, useState } from "react"

export const useSelectedText = () => {
    const [selectedText, setSelectedText] = useState<string>()

    useEffect(() => {
        const selectText = (event: MouseEvent) => {
            if (event.target instanceof Element && (['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.getAttribute('contentEditable'))) {
                const text = window.getSelection()?.toString()
                console.log(event.target.tagName, text)
            }
        }
        document.addEventListener('mouseup', selectText)
        return () => {
            document.removeEventListener('mouseup', selectText)
        }
    }, [])
}
