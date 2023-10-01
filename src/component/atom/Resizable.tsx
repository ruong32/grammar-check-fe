'use client'

import { cx } from "@/helper"
import { ReactNode, useEffect, useRef, useState } from "react"

type ResizableProps = {
	className?: string
	left?: ReactNode
	right?: ReactNode
}

const Resizable = (props: ResizableProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [leftWidth, setLeftWidth] = useState<number>(0)
	const [isResizing, setIsResizing] = useState<boolean>(false)
	const [currentRatio, setCurrentRatio] = useState<number>(0.5)

	useEffect(() => {
		if (containerRef.current) {
			setLeftWidth((containerRef.current.offsetWidth/2) - 13)
		}
		const zoomObserver = new MutationObserver(() => {
			if (containerRef.current) {
				setLeftWidth((containerRef.current.offsetWidth/2) - 13)
			}
		})
		zoomObserver.observe(document.documentElement, { attributeFilter: ['style'] })
		return () => {
			zoomObserver.disconnect()
		}
	}, [])

	useEffect(() => {
		const onWindowResize = () => {
			if (containerRef.current) {
				setLeftWidth(currentRatio*containerRef.current.offsetWidth - 13)
			}
		}
		window.addEventListener('resize', onWindowResize)
		return () => {
			window.removeEventListener('resize', onWindowResize)
		}
	}, [currentRatio])

	// useEffect(() => {
	// 	console.log(getComputedStyle(document.documentElement).fontSize)
	// }, [document.documentElement.style.fontSize])

	useEffect(() => {
		const resize = (event: MouseEvent) => {
			if (isResizing && containerRef.current) {
				const newWidth = event.clientX - containerRef.current.getBoundingClientRect().left
				setLeftWidth(newWidth)
				setCurrentRatio(newWidth/containerRef.current.offsetWidth)
			}
		}
		const cancelResize = () => {
			setIsResizing(false)
		}
		window.addEventListener("mousemove", resize)
		window.addEventListener("mouseup", cancelResize)
    return () => {
		window.removeEventListener("mousemove", resize)
		window.removeEventListener("mouseup", cancelResize)
    }
	}, [isResizing])

	return (
		<div ref={containerRef} className={cx("w-full flex", props.className)}>
			<div className="min-w-[20%] min-h-[inherit]" style={{width: leftWidth + 'px'}}>
				{props.left}
			</div>
			<div 
				className={cx(
					"mx-[12px] w-[2px] min-h-[inherit] transition-transform rounded-full cursor-col-resize bg-gray-400",
					"hover:scale-x-[2]"
				)}
				onMouseDown={() => setIsResizing(true)}
			></div>
			<div className="flex-1 min-w-[20%] min-h-[inherit]">
				{props.right}
			</div>
		</div>
	)
}

export default Resizable
