import { cookies as serverCookie } from 'next/headers'
import { LANG_COOKIE_NAME, LangNS } from '@/common'
import { i18n } from '@/i18n'

export const useI18nServer = (namespace?: LangNS) => {
    const lang = serverCookie().get(LANG_COOKIE_NAME)?.value
    return i18n(lang, namespace)
}
