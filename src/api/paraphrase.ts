import { CustomParaphraseRequest, GeneralReponse, ParaphraseRequest } from "@/types"
import { fetcher } from "@/helper"

export const paraphrase = (request: ParaphraseRequest) => {
    return fetcher<GeneralReponse>({
        method: 'POST',
        url: 'http://62.171.155.43:8001/api_paraphrase/v1',
        data: request
    })
}

export const customParaphrase = (request: CustomParaphraseRequest) => {
    return fetcher<GeneralReponse>({
        method: 'POST',
        url: 'http://62.171.155.43:8004/api_type_paraphrase/v1',
        data: request
    })
}
