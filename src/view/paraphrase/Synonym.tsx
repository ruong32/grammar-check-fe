'use client'

import React, { useState } from "react"
import { SynonymData } from "@/types"
import { cx } from "@/helper"
import * as Popover from '@radix-ui/react-popover'

type SynonymProps = {
	synonym: SynonymData
}

const Synonym = ({ synonym }: SynonymProps) => {
	const [label, setLabel] = useState<string>(Object.keys(synonym)[0])
	const [synonymOptions, setSynonymOptions] = useState<string[]>(Object.values(synonym)[0])

	const onSynonymOptionClick = (option: string) => {
		setSynonymOptions(options => {
			return [label, ...options.filter(item => item !== option)]
		})
		setLabel(option)
	}

	if (synonymOptions.length === 0) {
		return <span>{label}</span>
	}

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<span
					className={cx(
						'relative cursor-pointer',
						'hover:text-orange-500'
					)}
				>
					{label}
				</span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content align='start' asChild>
					<div
						className={cx(
							'absolute bg-white py-1 rounded-md rounded-tl-none max-h-32 w-max overflow-y-auto scrollbar text-gray-950 text-sm shadow-[1px_1px_4px] shadow-gray-600',
							'dark:bg-gray-900 dark:text-gray-50 dark:shadow-none'
						)}
					>
						{
							synonymOptions.map(option => (
								<Popover.Close asChild>
									<div
										key={option}
										className={cx(
											"px-2 bg-transparent cursor-pointer min-w-[5rem]",
											"hover:bg-green-300 dark:hover:bg-green-500"
										)}
										onClick={() => {
											onSynonymOptionClick(option)
										}}
									>
										{option}
									</div>
								</Popover.Close>
							))
						}
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}

export default Synonym
