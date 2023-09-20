'use client'

import { LANG_COOKIE_NAME, LangNS } from '@/common'
import { i18n } from '@/i18n'
import clientCookie from 'js-cookie'

export const useI18nClient = (namespace?: LangNS) => {
    const lang = clientCookie.get(LANG_COOKIE_NAME)
    return i18n(lang, namespace)
}
