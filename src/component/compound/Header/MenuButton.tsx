'use client'

import { Image } from "@/component/atom"
import { Menu } from "@/component/icon"
import { cx } from "@/helper"
import { useI18nClient } from "@/hook/useI18nClient"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const MenuButton = () => {
    const [openingSideMenu, setOpeningSideMenu] = useState<boolean>(false)
    const [t] = useI18nClient('header')

    const linkItemStyle = useMemo(() => cx(
        'px-4 py-3 transition-colors duration-300 cursor-pointer',
        'hover:bg-green-500'
    ), [])

    const LinkItem = ({name = '', href = ''}) => {
        return (
            <Link
                className={linkItemStyle}
                onClick={() => {
                    setOpeningSideMenu(false)
                }}
                href={href}
            >
                {name}
            </Link>
        )
    }

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
            <Menu 
                className='cursor-pointer lg:hidden' 
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpeningSideMenu(true)
                }}
            />
            <div
                data-opening={openingSideMenu}
                className={cx(
                    "fixed top-0 left-0 h-full w-full bg-[#00000088] transition-[visibility,opacity] duration-300 lg:hidden",
                    'data-[opening=true]:visible data-[opening=true]:opacity-100 data-[opening=true]:cursor-auto',
                    'data-[opening=false]:invisible data-[opening=false]:opacity-0 data-[opening=false]:cursor-none'
                )}
                onClick={() => setOpeningSideMenu(false)}
            >
                <div 
                    data-opening={openingSideMenu} 
                    className={cx(
                        "relative h-full bg-green-600 flex flex-col text-lg transition-[width,opacity] duration-300 text-white",
                        'data-[opening=true]:w-[18.75rem] data-[opening=true]:opacity-100',
                        'data-[opening=false]:w-[0rem] data-[opening=false]:opacity-0'
                    )}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center px-4 py-3 cursor-default">
                        <div className="text-2xl font-bold">Grammar Check</div>
                        {/* <Image className='h-[2.625rem] w-[2.625rem] rounded-full mr-3' sizes="100%" src='/asset/image/logo-dark-60x60.png' alt='logo'/> */}
                    </div>
                    <LinkItem href='/' name={t('paraphrase')}/>
                    {/* <LinkItem href='/analyzer' name={t('analyzer')}/> */}
                </div>
            </div>
        </>
    )
}

export default MenuButton
