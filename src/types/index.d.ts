import {CommentResponseType, UserFromDBType} from "./types";

export declare global { //расширяю тип  Request
    declare namespace Express {
        export interface Request {
            content: {
                user: UserFromDBType | null,
                comment: CommentResponseType | null,
            }
        }
    }
}