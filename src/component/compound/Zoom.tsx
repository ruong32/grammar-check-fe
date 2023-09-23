'use client'

import { useEffect, useState } from "react"
import { cx } from "@/helper"
import { Zoom as ZoomIcon } from "../icon"
import { useI18nClient } from "@/hook/useI18nClient"

type ZoomProps = {
	className?: string
}

const ZOOM_RATIO = [1, 1.25, 1.5] as const

const STORAGE_KEY = 'zoomRatio'

const Zoom = (props: ZoomProps) => {
	const [t] = useI18nClient()
	const [currentZoom, setCurrentZoom] = useState<typeof ZOOM_RATIO[number]>(1.5)
	const [open, setOpen] = useState<boolean>(false)

	useEffect(() => {
		const storedRatio = parseFloat(localStorage.getItem(STORAGE_KEY) || '0') || currentZoom
		if (ZOOM_RATIO.some(ratio => ratio === storedRatio)) {
			setCurrentZoom(storedRatio as typeof ZOOM_RATIO[number]);
		}
	}, [])

	useEffect(() => {
		document.documentElement.style.fontSize = `${currentZoom*100}%`
	}, [currentZoom])

	const onOptionClick = (zoomRatio: typeof ZOOM_RATIO[number]) => {
		setOpen(false)
		setCurrentZoom(zoomRatio)
		localStorage.setItem(STORAGE_KEY, String(zoomRatio))
	}

	return (
		<div className={cx('relative text-[14px] leading-[20px]', props.className)}>
			<div 
				className={cx(
					"flex items-center p-[8px] rounded-lg bg-slate-300 transition-[filter]",
					"dark:bg-slate-700",
					"hover:cursor-pointer hover:brightness-95"
				)}
				onClick={() => setOpen(!open)}
			>
				<ZoomIcon className="mr-[4px] cursor-pointer"/>{t('zoom')}
			</div>
			<div 
				className={cx(
					"absolute w-full bottom-full pt-[8px] pb-[8px] mb-[4px] bg-slate-300 rounded-md opacity-0 invisible pointer-events-none transition-opacity duration-300",
					'dark:bg-slate-700',
					open ? "opacity-100 visible pointer-events-auto" : ""
				)}
			>
				{
					ZOOM_RATIO.map(option => (
						<div
							key={option}
							className={cx(
								"pt-[4px] pb-[4px] pl-[8px] pr-[8px] bg-slate-300 flex justify-between",
								'dark:bg-slate-700',
								"hover:cursor-pointer hover:brightness-95"
							)}
							onClick={() => onOptionClick(option)}
						>
							<span>{option}x</span>{option === currentZoom && <span className="text-green-600">&#10003;</span>}
						</div>
					))
				}
			</div>
		</div>
	)
}

export default Zoom
