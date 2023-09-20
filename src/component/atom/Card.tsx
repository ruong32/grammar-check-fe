import { cx } from "@/helper"
import React from "react"

type CardProps = {
    icon?: React.ReactNode
    title: React.ReactNode
    description?: React.ReactNode
    className?: string
    iconClassName?: string
    titleClassName?: string
    descriptionClassName?: string
}

const Card = (props: CardProps) => {
    return (
        <div 
            className={cx(
                "p-4 bg-slate-300 rounded-lg flex flex-col items-center relative top-0 scale-100 transition-[inset,transform] duration-150",
                "dark:bg-gray-700",
                "hover:top-[-0.25rem] hover:scale-105",
                props.className
            )}
        >
            <div className={props.iconClassName}>{props.icon}</div>
            <h3 className={cx("mt-2 text-xl text-center", props.titleClassName)}>{props.title}</h3>
            <span className={cx("mt-2 text-sm", props.descriptionClassName)}>{props.description}</span>
        </div>
    )
}

export default Card
