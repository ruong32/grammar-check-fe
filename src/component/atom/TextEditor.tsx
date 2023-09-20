'use client'

import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactQuill, { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import { createUnderlineContext } from "./Underline"
import { cx, randomId } from "@/helper"
import { useI18nClient } from "@/hook/useI18nClient"
// import { UnderlineManager } from "./Underline/underlineManager"

type EditorProps = ReactQuillProps & {
}

const TextEditor = ({className, ...props}: EditorProps) => {
    const [t] = useI18nClient()
    const editorId = useMemo(() => randomId(), [])
    const [value, setValue] = useState<string>('')
    // const underlineManager = useRef<UnderlineManager>()

    useEffect(() => {
        // const editorTextfield = document.querySelector(`#${editorId} .ql-container`)
        // if (!editorTextfield) {
        //     return
        // }
        // underlineManager.current = createUnderlineContext(editorTextfield, setValue)
    }, [])
    
    return (
        <ReactQuill 
            id={editorId}
            className={cx(
                className,
                '[&>.ql-container]:text-sm'
            )}
            // value={value}
            // onChange={(value) => {
            //     setValue(value)
            //     underlineManager.current?.onInputChange()
            // }}
            placeholder={t('editorPlaceholder')}
            {...props}
        />
    )
}

export default TextEditor
