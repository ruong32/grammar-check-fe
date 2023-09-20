'use client'

import { Delete } from "@/component/icon"
import { cx } from "@/helper"

type CopyButtonProps = {
    targetId: string
}

const ClearButton = ({ targetId }: CopyButtonProps) => {
    return (
        <div 
            className={cx(
                "bg-white rounded-md p-1 cursor-pointer",
                "[&_*]:cursor-pointer",
                "hover:bg-gray-100",
                "active:bg-red-500 active:text-white",
            )}
            onClick={() => {
                const target = document.getElementById(targetId)
                if (target) {
                    target.innerHTML = ''
                    target.focus()
                }
            }}
        >
            <Delete/>
        </div>
    )
}

export default ClearButton
