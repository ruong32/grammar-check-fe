'use client'

import { Copy } from "@/component/icon"
import { cx } from "@/helper"
import copy from "copy-to-clipboard"

type CopyButtonProps = {
    targetId: string
}

const CopyButton = ({ targetId }: CopyButtonProps) => {
    return (
        <div 
            className={cx(
                "bg-white rounded-md p-1 cursor-pointer",
                "dark:bg-slate-700",
                "[&_*]:cursor-pointer",
                "hover:bg-gray-100",
                "active:bg-sky-500 active:text-white",
                "dark:active:bg-sky-500 dark:active:text-white",
            )}
            onClick={() => {
                const target = document.getElementById(targetId)
                copy(target?.innerText || '')
            }}
        >
            <Copy/>
        </div>
    )
}

export default CopyButton
