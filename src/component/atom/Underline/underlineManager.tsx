import { isMouseEntered, randomId } from "@/helper"
import Underline from "./underline"

export enum UnderlineType {
	ERROR, WARNING, SUGGESTION
}

export type UnderlineItem = {
	type: UnderlineType
	underline: React.ReactNode
	range: Range
	underlineId: string
}

export class UnderlineManager {
	private shadowRoot: Element
	private items: UnderlineItem[] = []
	private valueUpdater
	private underlinesUpdater?: (items: UnderlineItem[]) => void

	private mouseListener = (event: MouseEvent) => {
		for(const item of this.items) {
			const underlineElement = this.shadowRoot?.shadowRoot?.querySelector(`#${item.underlineId}`)
			if (!underlineElement) {
				continue
			}
			const popup = underlineElement.firstElementChild
			if (!popup) {
				continue
			}
			if (isMouseEntered({x: event.x, y: event.y}, item.range.getBoundingClientRect())) {
				popup.setAttribute('data-state', 'open')
			} else if (!isMouseEntered({x: event.x, y: event.y}, popup.getBoundingClientRect())) {
				popup.setAttribute('data-state', 'close')
			}
		}
	}

	constructor(shadowRoot: Element, setEditorValue: (value: string) => void) {
		this.shadowRoot = shadowRoot
		document.addEventListener('mousemove', this.mouseListener)
		this.valueUpdater = setEditorValue
	}

	setUnderlinesUpdater(underlinesUpdater: (items: UnderlineItem[]) => void) {
		this.underlinesUpdater = underlinesUpdater
	}

	setItems(items: UnderlineItem[]) {
		this.items = items
	}

	addItem(item: UnderlineItem) {
		this.items.push(item)
		return this.getItems()
	}

	getItems() {
		return [...this.items]
	}

	clearItems() {
		this.setItems([])
	}

	onInputChange() {
		if (!this.underlinesUpdater) {
			return
		}
		const data = textParser(this.shadowRoot.textContent, /error/g)
		this.clearItems()
		for (const item of data) {
			const range = document.createRange()
			if (!this.shadowRoot.firstChild) {
				return
			}
			range.setStart(this.shadowRoot.firstChild.childNodes[0].childNodes[0], item.start)
			range.setEnd(this.shadowRoot.firstChild.childNodes[0].childNodes[0], item.end)
			const rect = range.getBoundingClientRect()
			const underlineId = randomId()
			this.addItem({
				type: UnderlineType.ERROR,
				underline: (
					<Underline 
						id={underlineId}
						key={`${rect.top}+${rect.left}`}
						rect={rect}
						editor={this.shadowRoot}
						type={UnderlineType.ERROR}
						popupAction={() => {
							this.valueUpdater(`<p>${this.shadowRoot.textContent?.substring(0, item.start) + 'correct' + this.shadowRoot.textContent?.substring(item.end)}<p>`)
						}}
					/>
				),
				range: range,
				underlineId: underlineId
			})
		}
		this.underlinesUpdater(this.getItems())
	}
}

export const textParser = (text: string | null, condition: RegExp) => {
	if (!text) {
		return []
	}
	let matches
	if (condition.global) {
		matches = text.matchAll(condition)
	} else {
		matches = [text.match(condition)]
	}
	const result: {start: number, end: number}[] = []
	for(const match of matches) {
		if (typeof match?.index !== 'number') {
			continue
		}
		result.push({start: match.index, end: match.index + match[0].length})
	}
	return result
}
