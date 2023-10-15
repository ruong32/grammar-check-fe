import { SynonymData } from "./synonym"

export type HistoryItem = {
    input: string,
    result: string,
    detail: number[][]
    synonyms: SynonymData[]
    createdAt: number
}
