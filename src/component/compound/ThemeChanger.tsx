'use client'

import { cx } from "@/helper"
import { useState } from "react"
import { Tooltip } from "../atom"
import { Moon, Sun } from "../icon"
import { useI18nClient } from "@/hook/useI18nClient"

export const THEME_MODE_STORAGE_KEY = 'themeMode'
export enum ThemeMode {dark = 'dark', light = 'light'}
export const AVAILABLE_THEMES = {
    [ThemeMode.light]: {
        next: ThemeMode.dark,
        nextIcon: <Moon/>,
        onNext: () => {
            document.documentElement.classList.add(ThemeMode.dark)
        }
    },
    [ThemeMode.dark]: {
        next: ThemeMode.light,
        nextIcon: <Sun/>,
        onNext: () => {
            document.documentElement.classList.remove(ThemeMode.dark)
        }
    }
} as const

type ThemeChangerProps = {
    className?: string
}

const ThemeChanger = ({ className }: ThemeChangerProps) => {
	const [t] = useI18nClient()
    const [themeMode, setThemeMode] = useState<ThemeMode>((localStorage.getItem(THEME_MODE_STORAGE_KEY) || ThemeMode.light) as ThemeMode)

    return (
        <Tooltip
            className={cx(
                "p-1 rounded-full border border-gray-800 cursor-pointer text-gray-800",
                "dark:border-gray-100 dark:text-gray-100",
                className
            )}
            onClick={() => {
                setThemeMode(() => {
                    localStorage.setItem(THEME_MODE_STORAGE_KEY, String(AVAILABLE_THEMES[themeMode].next))
                    AVAILABLE_THEMES[themeMode].onNext()
                    return AVAILABLE_THEMES[themeMode].next
                })
            }}
            content={`${t('changeTo')} ${t(AVAILABLE_THEMES[themeMode].next)}`}
        >
            {AVAILABLE_THEMES[themeMode].nextIcon}
        </Tooltip>
    )
}

export default ThemeChanger
