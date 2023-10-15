import { DEFAULT_LANG, LANG, LangNS } from "@/common"

export const i18n = (lang?: string, namespace: LangNS = 'common') => {
    if (!lang || !Object.keys(LANG).includes(lang)) {
        lang = DEFAULT_LANG
    }
    let data: {[k: string]: string} = {}
    try {
        data = require(`./locales/${lang}/${namespace}.json`)
    } catch {}
    const translate = (key?: string) => {
        if (!key) {
            return ''
        }
        if (!data[key]) {
            return key
        }
        return data[key]
    }
    return [translate]
}
