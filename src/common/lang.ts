export enum LANG {
    vi = 'vi',
    en = 'en'
}

export const DEFAULT_LANG = LANG.en

export type LangNS = 'header' | 'paraphrase' | 'common' | 'analyzer'

export const LANG_COOKIE_NAME = 'NEXT_LOCALE'
