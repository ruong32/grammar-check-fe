import { cx } from "@/helper"
import React from "react"

type TagProps = React.PropsWithChildren & {
    className?: string
}

const Tag = ({className, children}: TagProps) => {
    return (
        <div 
            className={cx(
                'px-2 py-1 border-[1px] border-orange-500 rounded-xl text-sm',
                className
            )}
        >
            {children}
        </div>
    )
}

export default Tag
