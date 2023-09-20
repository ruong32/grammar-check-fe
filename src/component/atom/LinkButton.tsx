import { cx } from "@/helper"
import Link from "next/link"
import React from "react"

const LinkButton = ({ children, className, ...props }: React.ComponentProps<typeof Link>) => {
    return (
        <Link 
            className={cx(
                "p-2 rounded-md cursor-pointer transition-colors duration-300 [&_*]:cursor-pointer",
                "hover:bg-sky-300",
                "hover:dark:bg-sky-500"
            )} 
            target="_blank" 
            { ...props }
        >
            { children }
        </Link>
    )
}

export default LinkButton
