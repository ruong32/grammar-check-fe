export type GeneralRequest = {
    data: string
}

export type ParaphraseRequest = GeneralRequest & {
    mode: string,
    synonym: number,
    lang: string
}

export type CustomParaphraseRequest = GeneralRequest & {
    type_content: string,
    synonym: number,
    lang: string
}
