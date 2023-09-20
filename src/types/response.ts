import { SynonymData } from "./synonym"

export type GeneralReponse = {
    ok: boolean
    result: string
}

export type GetSynonymResponse = GeneralReponse & {
    synonym: SynonymData[]
}
