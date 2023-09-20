'use client'

import { createRoot } from "react-dom/client"
import { shadowRootInjector } from "@/helper"
import { useEffect, useMemo, useState } from "react"
import { UnderlineItem, UnderlineManager } from "./underlineManager"

const createStyle = () => {
	const styleTag = document.createElement('style')
	styleTag.innerHTML = `
		.wrapper {
			position: relative;
			pointer-events: none;
		}
		.underline {
			position: absolute;
			background: #FF000030;
			border-bottom: 2px solid red;
		}
		.popup-wrapper {
			position: absolute;
			top: calc(100% - 2px);
			padding-top: 6px;
			transition: .15s;
			z-index: 10
		}
		.popup {
			background: white;
			width: 200px;
			padding: 8px;
			border-radius: 8px;
			box-shadow: 0 1px 1px #00000055;
		}
		.popup-wrapper[data-state="open"] {
			visibility: visible;
			opacity: 1;
			pointer-events: auto;
		}
		.popup-wrapper[data-state="close"] {
			visibility: hidden;
			opacity: 0;
			pointer-events: none;
		}
	`
	return styleTag
}

type UnderlineBrokerProps = {
	editor: Element,
	underlineManager: UnderlineManager
}

const UnderlineBroker = ({ editor, underlineManager }: UnderlineBrokerProps) => {
	const [underlines, setUnderlines] = useState<UnderlineItem[]>([])

	useEffect(() => {
		underlineManager.setUnderlinesUpdater(setUnderlines)
		const eventHandler = () => {
			underlineManager.onInputChange()
		}
		editor.addEventListener('input', eventHandler)
		const resizeObserver = new ResizeObserver(eventHandler)
		resizeObserver.observe(editor)
		return () => {
			editor.removeEventListener('input', eventHandler)
			resizeObserver.disconnect()
		}
	}, [])
	
	return (
		<div className="wrapper">
			<div 
				style={{
					position: 'absolute',
					top: -1*editor.clientHeight + 'px',
				}}
			>
				{
					underlines.map(underline => underline.underline)
				}
			</div>
		</div>
	)
}

export const createUnderlineContext = (editor: Element, setEditorValue: (value: string) => void) => {
	const div = document.createElement('div')
	const contentRoot = createRoot(div)
	const underlineManager =  new UnderlineManager(editor, setEditorValue)
	contentRoot.render(<UnderlineBroker editor={editor} underlineManager={underlineManager}/>)
	shadowRootInjector(editor, [createStyle(), div])
	return underlineManager
}
