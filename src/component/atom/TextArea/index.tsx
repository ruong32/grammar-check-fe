import React, { forwardRef, useId, useMemo } from "react"
import { cx } from "@/helper"
import CopyButton from "./CopyButton"
import ClearButton from "./ClearButton"

type TextAreaProps = React.HTMLProps<HTMLDivElement> & {

}

const TextArea = forwardRef<HTMLDivElement, TextAreaProps>(({ className, id, ...props }, ref) => {
    const textAreaId = useMemo(() => {
        return id || useId()
    }, [])
    return (
        <div className="relative h-full min-h-[inherit] flex [&>.toolbox]:hover:flex [&>.toolbox]:focus-within:flex">
            <div
                ref={ref}
                id={textAreaId}
                className={cx(
                    'scrollbar bg-white overflow-y-auto resize-y whitespace-pre-line w-full p-2 rounded-lg text-sm outline-transparent transition-[outline] duration-[250ms]',
				    'dark:bg-gray-500',
                    'focus:outline-green-500',
                    className
                )} 
                {...props}
                onPaste={e => {
                    e.preventDefault();
                    const text = e.clipboardData ? e.clipboardData.getData("text/plain") : "";
                    if (document.queryCommandSupported?.("insertText")) {
                        return document.execCommand("insertText", false, text);
                    }
                    const selection = document.getSelection();
                    if (!selection) return;
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(new Text(text));
                    range.collapse();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        document.execCommand('insertLineBreak')
                        event.preventDefault()
                    }
                }}
                contentEditable
            />
            <div className="toolbox absolute hidden top-full left-1 pt-1 space-x-1">
                <CopyButton targetId={textAreaId}/>
                <ClearButton targetId={textAreaId}/>
            </div>
        </div>
    )
})

export default TextArea
