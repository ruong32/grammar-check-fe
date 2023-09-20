import { fetcher } from "@/helper";
import { GeneralRequest, GetSynonymResponse } from "@/types";

export const getSynonym = async (request: GeneralRequest) => {
    return fetcher<GetSynonymResponse>({
        method: 'POST',
        url: 'http://62.171.155.43:8003/synonym',
        data: request
    })
}
