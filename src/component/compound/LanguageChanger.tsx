'use client'

import { LANG, LANG_COOKIE_NAME } from "@/common"
import { cx } from "@/helper"
import cookie from "js-cookie"

type LanguageChangerProps = {
    className?: string
}

const LanguageChanger = ({ className }: LanguageChangerProps) => {
    const currentLang = cookie.get(LANG_COOKIE_NAME) || LANG.en
    const changeLanguage = (lang: LANG) => {
        if (currentLang === lang) {
            return
        }
        cookie.set(LANG_COOKIE_NAME, lang)
        location.reload()
    }

    const itemStyle = ['py-1 px-2 cursor-pointer rounded [&~*]:ml-2']
    const currentLangStyle = 'bg-indigo-600 text-gray-50 cursor-default'

    return (
        <div className={cx('flex text-sm', className)}>
            <div className={cx(itemStyle, currentLang === LANG.en ? currentLangStyle : null)} onClick={() => changeLanguage(LANG.en)}>Eng</div>
            <div className={cx(itemStyle, currentLang === LANG.vi ? currentLangStyle : null)} onClick={() => changeLanguage(LANG.vi)}>Vie</div>
        </div>
    )
}

export default LanguageChanger
