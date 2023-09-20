import { cx } from "@/helper"
import React from "react"

type ContainerProps = React.PropsWithChildren & {
    className?: string
}

const Container = ({ className, children }: ContainerProps) => {
    return (
        <div className={cx(className, 'w-full px-4 transition-[padding] duration-300 md:px-8 lg:max-w-[90%] lg:w-[60rem] lg:px-0 lg:mx-auto')}>
            { children }
        </div>
    )
}

export default Container
