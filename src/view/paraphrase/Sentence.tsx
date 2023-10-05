'use client'

import { cx } from "@/helper"
import { PropsWithChildren } from "react"

type SentenceProps = PropsWithChildren & {
    type: 'input' | 'result'
    order: number | string
}

const ID_PREFIX = {
    'input': 'input-sentence-',
    'result': 'result-sentence-'
} as const

const Sentence = ({ type, order, children }: SentenceProps) => {
    const unHighlightAll = () => {
        Object.values(ID_PREFIX).forEach(idPrefix => {
            document.querySelectorAll(`[id^='${idPrefix}']`).forEach(element => {
                element.removeAttribute('data-highlight')
            })
        })
    }
    const onSentenceClick = () => {
        unHighlightAll()
        const inputSentence = document.getElementById(`${ID_PREFIX.input}${order}`)
        const resultSentence = document.getElementById(`${ID_PREFIX.result}${order}`)
        inputSentence?.setAttribute('data-highlight', '')
        resultSentence?.setAttribute('data-highlight', '')
    }

    return (
        <span 
            id={`${ID_PREFIX[type]}${order}`} 
            className={cx(
                'data-[highlight]:bg-green-400/20'
            )}
            onClick={onSentenceClick}
        >
            {children}
        </span>
    )
}

export default Sentence
