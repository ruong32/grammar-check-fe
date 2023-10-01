import dynamic from "next/dynamic"

export { default as Image } from './Image'
export { default as Container } from './Container'
export { default as Tag } from './Tag'
export { default as Button } from './Button'
export { default as LinkButton } from './LinkButton'
export { default as Card } from './Card'
export { default as Input } from './Input'
export { default as Slider } from './Slider'
export { default as TextArea } from './TextArea'
export { default as Tooltip } from './Tooltip'
export { default as Resizable } from './Resizable'

const TextEditor = dynamic(() => import('./TextEditor'), {
    ssr: false
})
export { TextEditor } 
