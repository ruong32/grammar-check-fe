import { twMerge } from "tailwind-merge"
import axios, { AxiosRequestConfig } from "axios"

export const cx = twMerge

export const isServerSide = () => typeof window === 'undefined'

export const removeVietnameseTones = (str: string) => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
}

export const shadowRootInjector = (root: Element, elements: Element[]) => {
	root.attachShadow({mode: 'open'})
	if (!root.shadowRoot) {
		return
	}
	const slot = document.createElement('slot')
	root.shadowRoot.append(slot)
	for (const element of elements) {
		root.shadowRoot.append(element)
	}
}

export const isMouseEntered = (mousePosition: {x: number, y: number}, elementRect: DOMRect) => (
	elementRect.left <= mousePosition.x &&
	mousePosition.x <= elementRect.left + elementRect.width &&
	elementRect.top <= mousePosition.y &&
	mousePosition.y <= elementRect.top + elementRect.height
)

export const randomLetter = () => ((Math.floor(Math.random()*26)) + 10).toString(36)

export const randomId = (range = 1e16, base = 16) => randomLetter() + (Math.floor(Math.random()*range)).toString(base)

export const fetcher = async <T>(config: AxiosRequestConfig): Promise<[T, null] | [null, any]> => {
    try {
        const response = await axios<T>(config)
		if (200 <= response.status && response.status <= 299) {
			return [response.data, null]
		}
		return [null, response.data]
    } catch (error) {
        return [null, error]
    }
}

export const removeItemFromArray = <T> (arr: T[], item: T) => {
	const index = arr.indexOf(item)
	if (index > -1) {
		return arr.splice(index, 1)
	}
	return arr
}
