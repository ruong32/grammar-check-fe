'use client'

import { useState, useEffect } from "react"
import { Root, createRoot } from 'react-dom/client'
import { paraphrase, customParaphrase, getSynonym } from "@/api"
import { SUGGESTED_MODES } from "@/common"
import { Button, Container, Input, Slider, TextArea } from "@/component/atom"
import { Spinner } from "@/component/icon"
import { cx } from "@/helper"
import { useI18nClient } from "@/hook/useI18nClient"
import Sentence from "./Sentence"
import { SynonymData } from "@/types"
import Synonym from "./Synonym"

const HomeView = () => {
	const [t] = useI18nClient('paraphrase')
	const [input, setInput] = useState<string>('')
	const [result, setResult] = useState<string>('')
	const [isProcessing, setIsProcessing] = useState<boolean>(false)
	const [synonym, setSynonym] = useState<number>(30)
	const [currentMode, setCurrentMode] = useState<typeof SUGGESTED_MODES[number]>('standard')
	const [customMode, setCustomMode] = useState<string>('')
	const [synonymList, setSynonymList] = useState<SynonymData[]>([])
	const [disableCustomMode, setDisableCustomMode] = useState<boolean>(false)

	const canUseCustomMode = () => !disableCustomMode && customMode.length > 0

	const renderModeSuggestion = () => {
		const selectedModeStyle = "font-semibold border-b-2 border-green-500"
		return SUGGESTED_MODES.map(mode => (
			<span
				key={mode}
				onClick={() => {
					setDisableCustomMode(true)
					setCurrentMode(mode)
				}}
				className={cx(
					!canUseCustomMode() && mode === currentMode ? selectedModeStyle : null,
					"cursor-pointer"
				)}
			>
				{t(mode)}
			</span>
		))
	}

	const submit = async () => {
		setIsProcessing(true)
		const [paraphraseResult] = await (canUseCustomMode() ?
			customParaphrase({
				data: input,
				type_content: customMode,
				synonym: synonym
			}) :
			paraphrase({
				data: input,
				mode: currentMode,
				synonym: synonym
			})
		)
		if (paraphraseResult?.result) {
			const [synonymResult] = await getSynonym({data: paraphraseResult.result})
			if (synonymResult?.synonym) {
				setSynonymList(synonymResult.synonym)
			} else {
				setSynonymList([])
			}
		}
		if (paraphraseResult?.result) {
			setResult(paraphraseResult.result)
		}
		setIsProcessing(false)
	}

	const renderSentences = (root: Root | undefined, paragraph: string, type: 'input' | 'result') => {
		if (!root) {
			return
		}
		const sentences = paragraph.match( /[^\.!\?]+[\.!\?]+|[^\.!\?]+/g)
		const sentenceElements = sentences?.map((sentence, index) => {
			return <Sentence key={index} type={type} order={index}>{sentence}</Sentence>
		})
		root.render(sentenceElements)
	}

	const renderSentencesWithSynonyms = (root: Root | undefined, paragraph: string, synonyms: SynonymData[], type: 'input' | 'result') => {
		if (!root) {
			return
		}
		const sentences = paragraph.match( /[^\.!\?]+[\.!\?]+|[^\.!\?]+/g)
		const sentenceElements = sentences?.map((sentence, index) => {
			const words = sentence.match(/\w+|\s+|[^\s\w]+/g)
			return (
				<Sentence 
					key={index}
					type={type}
					order={index}
				>
					{
						words ? 
						words.map((word, wordIndex) => {
							const synonymIndex = synonyms.findIndex(item => Object.keys(item)[0] === word)
							if (synonymIndex > -1) {
								const synonym = synonyms.splice(synonymIndex, 1)[0]
								return <Synonym key={`${word}-${index}-${wordIndex}`} synonym={synonym}/>
							}
							return word
						}) :
						sentence
					}
				</Sentence>
			)
		})
		root.render(sentenceElements)
	}

	useEffect(() => {
		const initRoot = (id: string) => {
			const rootElement = document.getElementById(id)
			if (!rootElement) {
				return
			}
			return createRoot(rootElement)
		}
		const inputRoot = initRoot('paraphrase-input-field')
		const resultRoot = initRoot('paraphrase-result-field')
		renderSentences(inputRoot, input, 'input')
		renderSentencesWithSynonyms(resultRoot, result, synonymList, 'result')
		return () => {
			inputRoot?.unmount()
			resultRoot?.unmount()
		}
	}, [result])

	return (
		<Container className="relative">
			{isProcessing && (
				<div className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-gray-700 z-10">
					<div className="flex bg-[#ffffff] p-2 rounded-lg">
						<Spinner className="text-green-500 mr-2"/> Processing, please wait...
					</div>
				</div>
			)}
			<div className={cx(isProcessing ? "opacity-30 pointer-events-none" : null)}>
				<div className="mt-8 flex w-full">
					<Input
						containerClassName="flex-1 rounded-r-none"
						placeholder={t('customModePlaceholder')}
						value={customMode}
						onChange={e => { setCustomMode(e.currentTarget.value) }}
						onClick={() => setDisableCustomMode(false)}
						disable={disableCustomMode}
					/>
					<Button className="rounded-l-none text-white" color='green' onClick={submit}>{t('paraphrase')}</Button>
				</div>
				<div className="mt-3 mb-4 flex justify-between items-start flex-wrap">
					<div className="flex flex-wrap [&>span]:mx-2 [&>span]:mb-2">
						{
							renderModeSuggestion()
						}
					</div>
					<div className="flex items-center gap-3">
						<p>{t('synonym')}</p>
						<Slider
							value={[synonym]}
							onValueChange={(value) => {
								const newSynonym = value[0] < 30 ? 30 : value[0]
								setSynonym(newSynonym)
							}}
						/>
					</div>
				</div>
				<div className="flex gap-6 [&>*]:flex-1">
					<TextArea
						id="paraphrase-input-field"
						className="min-h-[40vh] p-2 rounded-lg text-sm"
						placeholder={t('inputPlaceholder')}
						onInput={e => {
							setInput(e.currentTarget.innerText)
						}}
					/>
					<TextArea
						id="paraphrase-result-field"
						placeholder={t('resultPlaceholder')}
						className="min-h-[40vh] p-2 rounded-lg text-sm"
					/>
				</div>
			</div>
		</Container>
	)
}

export default HomeView
