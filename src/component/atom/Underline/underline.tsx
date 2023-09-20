import React from "react"
import { UnderlineType } from "./underlineManager"

type UnderlineProps = {
    rect: DOMRect
    editor: Element
    type: UnderlineType
    id: string
    popupAction?: () => void
}

const Underline = ({ id, rect, editor, popupAction }: UnderlineProps) => {
    return (
        <div
            id={id}
            className="underline"
            style={{
                height: rect.height + 'px',
                width: rect.width + 'px',
                top: rect.top - editor.getBoundingClientRect().top + 'px',
                left: rect.left - 1 - editor.getBoundingClientRect().left + 'px'
            }}
        >
            <div className="popup-wrapper" data-state='close'>
                <div className="popup">
                    <span>popup</span><br/>
                    <button onClick={popupAction}>replace</button>
                </div>
            </div>
        </div>
    )
}

export default Underline
