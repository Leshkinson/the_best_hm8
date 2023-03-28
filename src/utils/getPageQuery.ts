import {DefaultValueListType} from "../types/types";
import {ParsedQs} from "qs";

export const getPageQuery = (query : ParsedQs, defaultValue : DefaultValueListType) => {
    return {
        pageNumber: Number(query.pageNumber || defaultValue.PAGE_NUMBER),
        pageSize: Number(query.pageSize || defaultValue.PAGE_SIZE),
        sortBy: query.sortBy as string || defaultValue.FIELD_FOR_SORT,
        sortDirection: query.sortDirection as string || defaultValue.SORT_DIRECTION
    }
}