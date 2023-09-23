import { cx } from "@/helper"
import React, { HTMLProps } from "react"

type TooltipProps = HTMLProps<HTMLDivElement> & {
    content?: string
}

const Tooltip = ({className, children, content = '', ...props}: TooltipProps) => {
    return (
        <div 
            className={cx(
                className, 'relative',
                'before:content-[attr(data-tooltip)] before:absolute before:p-1 before:w-max before:right-0 before:top-[calc(100%+0.25rem)]',
                'before:text-xs before:border before:rounded-lg before:bg-gray-600 before:text-gray-50',
                'before:transition-opacity before:opacity-0 before:invisible',
                'hover:before:opacity-100 hover:before:visible'
            )}
            data-tooltip={content}
            {...props}
        >
            {children}
        </div>
    )
}

export default Tooltip
