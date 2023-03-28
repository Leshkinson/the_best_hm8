import {CommentResponseFromDBType, CommentResponseType} from "../types/types";

export const commentModels = (comments: CommentResponseFromDBType[] | CommentResponseFromDBType): CommentResponseType[] | CommentResponseType => {
    const commentConverter = (comment: CommentResponseFromDBType) => {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    }
    if (Array.isArray(comments)) {
        return comments.map((c: CommentResponseFromDBType) => commentConverter(c))
    }
    return commentConverter(comments)
}