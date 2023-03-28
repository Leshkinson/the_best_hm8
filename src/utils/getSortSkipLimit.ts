import {QueryPageType} from "../types/types";
import {Sort} from "mongodb";

export const getSortSkipLimit = async (query: QueryPageType):Promise<(number | Sort)[]> => {
    const sortBy = query?.sortBy.toString()
    const sortDirection = query?.sortDirection
    const sort = {[sortBy]: sortDirection === "asc" ? 1 : -1} as Sort
    const pageNumber = query?.pageNumber
    const limit = query?.pageSize
    const skip: number = (+pageNumber - 1) * +limit
    return [sort,skip ,limit]
}