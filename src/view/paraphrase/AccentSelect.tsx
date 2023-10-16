'use client'

import { ReactNode, useEffect, useState } from "react"
import { Image } from "@/component/atom"
import { Check, ChevronDown } from "@/component/icon"
import { cx } from "@/helper"
import * as Select from "@radix-ui/react-select"
import { STORAGE_KEY } from "@/common"
import { useI18nClient } from "@/hook/useI18nClient"

type Language = {
	code: string
	label: ReactNode
	value: string
}

type AccentSelectProps = {
	className?: string
	onChange?: (lang: Language) => void
}

const flagStyle = "h-5 w-5 rounded-full mr-2"

const itemStyle = "px-2 py-2 rounded-md cursor-pointer hover:bg-green-500/20"
const activeItemStyle = "bg-green-500 text-gray-50 hover:bg-green-500"

const AccentSelect = (props: AccentSelectProps) => {
	const [t] = useI18nClient()

	const ENGLISH = [
		{
			code: 'en-us',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/en-us.png' alt='en-us' /><span>{t('en-us')}</span></div>,
			value: 'US',
		},
		{
			code: 'en-uk',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/en-uk.png' alt='en-uk' /><span>{t('en-uk')}</span></div>,
			value: 'UK',
		},
		{
			code: 'en-ca',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/en-ca.png' alt='en-ca' /><span>{t('en-ca')}</span></div>,
			value: 'CA',
		},
		{
			code: 'en-au',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/en-au.png' alt='en-au' /><span>{t('en-au')}</span></div>,
			value: 'AU',
		}
	]
	
	const LANGUAGES = [
		{
			code: 'vi',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/vi.png' alt='vi' /><span>{t('vi')}</span></div>,
			value: 'VI',
		},
		{
			code: 'kr',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/kr.png' alt='kr' /><span>{t('kr')}</span></div>,
			value: 'KOR',
		},
		{
			code: 'jp',
			label: <div className="flex"><Image className={flagStyle} src='/assets/img/jp.png' alt='jp' /><span>{t('jp')}</span></div>,
			value: 'JAP',
		}
	]

	const [selectedLanguage, setSelectedLanguage] = useState<Language>(ENGLISH[0])
	const [selectedEnglish, setSelectedEnglish] = useState<Language>(ENGLISH[0])
	const [openEnglishSelect, setOpenEnglishSelect] = useState<boolean>(false)

	useEffect(() => {
		try {
			const storedLanguage: Language = JSON.parse(localStorage.getItem(STORAGE_KEY.ACCENT_LANGUAGE) || '')
			setSelectedLanguage(storedLanguage)
			ENGLISH.forEach(accent => {
				if (accent.code === storedLanguage.code) {
					setSelectedEnglish(accent)
				}
			})
		} catch {
			setSelectedLanguage(ENGLISH[0])
		}
	}, [])

	useEffect(() => {
		props.onChange?.(selectedLanguage)
	}, [selectedLanguage])

	const selectLanguage = (language: Language) => {
		setSelectedLanguage(language)
		localStorage.setItem(STORAGE_KEY.ACCENT_LANGUAGE, JSON.stringify(language.code))
	}

	return (
		<div
			className={cx(
				"flex flex-wrap space-x-2 text-sm", props.className
			)}
		>
			<Select.Root open={openEnglishSelect} onOpenChange={open => setOpenEnglishSelect(open)}>
				<Select.Trigger asChild>
					<div 
						className={cx(
							'flex items-center', 
							itemStyle, ENGLISH.some(accent => accent.code === selectedLanguage.code) ? activeItemStyle : null
						)}
					>
						{selectedEnglish.label}
						<ChevronDown className="ml-2" height={20} width={20} />
					</div>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content className="py-1 space-y-1 w-full rounded-md text-sm bg-gray-50 shadow-md dark:bg-gray-700" position='popper'>
						{
							ENGLISH.map(accent => (
								<div 
									key={accent.code}
									onClick={() => {
										selectLanguage(accent)
										setOpenEnglishSelect(false)
										setSelectedEnglish(accent)
									}}
									className="px-2 py-1 flex items-center cursor-pointer outline-none hover:bg-gray-200/50 hover:dark:bg-gray-600"
								>
									<div>{accent.label}</div>
									{ accent.code === selectedLanguage.code && <Check height={20} width={20} className="ml-2 text-green-500"/> }
								</div>
							))
						}
					</Select.Content>
				</Select.Portal>
			</Select.Root>
			{
				LANGUAGES.map(language => (
					<div
						key={language.code}
						className={cx(itemStyle, selectedLanguage.code === language.code ? activeItemStyle : null)}
						onClick={() => selectLanguage(language)}
					>
						{language.label}
					</div>
				))
			}
		</div>
	)
}

export default AccentSelect
