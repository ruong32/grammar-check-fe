'use client'

import { Setting } from "@/component/icon"
import { cx } from "@/helper"
import { useI18nClient } from "@/hook/useI18nClient"
import { useEffect, useState } from "react"
import LanguageChanger from "../LanguageChanger"
import ThemeChanger from "../ThemeChanger"
import Zoom from "../Zoom"

const MenuButton = () => {
    const [openingSideMenu, setOpeningSideMenu] = useState<boolean>(false)
    const [t] = useI18nClient('header')

    useEffect(() => {
        const onScreenWidthChange = () => {
            if (document.body.offsetWidth <= 1024) {
                setOpeningSideMenu(false)
            }
        }
        window.addEventListener('resize', onScreenWidthChange)
        return () => {
            window.removeEventListener('resize', onScreenWidthChange)
        }
    }, [])

    return (
        <>
            <Setting 
                className='cursor-pointer select-none' 
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpeningSideMenu(true)
                }}
            />
            <div
                data-opening={openingSideMenu}
                className={cx(
                    "fixed top-0 left-0 h-full w-full bg-[#00000088] transition-[visibility,opacity] duration-300",
                    'data-[opening=true]:visible data-[opening=true]:opacity-100 data-[opening=true]:cursor-auto',
                    'data-[opening=false]:invisible data-[opening=false]:opacity-0 data-[opening=false]:cursor-none'
                )}
                onClick={() => setOpeningSideMenu(false)}
            >
                <div 
                    data-opening={openingSideMenu} 
                    className={cx(
                        "relative h-full bg-gray-200 flex flex-col text-lg transition-[width,opacity] duration-300 text-gray-900",
                        "dark:bg-gray-900 dark:text-gray-50",
                        'data-[opening=true]:w-[18.75rem] data-[opening=true]:opacity-100',
                        'data-[opening=false]:w-[0rem] data-[opening=false]:opacity-0'
                    )}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center px-4 py-3 cursor-default border-b border-gray-300 dark:border-gray-700">
                        <div className="text-xl font-bold">{t('settings')}</div>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] items-center gap-y-3 gap-x-4 mt-3 px-4 text-sm">
                        <div>{t('language')}</div><LanguageChanger/>
                        <div>{t('theme')}</div><ThemeChanger/>
                        <div>{t('zoom')}</div><Zoom type="slider"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuButton