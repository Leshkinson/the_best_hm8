import {CommentResponseFromDBType, CommentResponseType} from "../types/types";
import {commentCollections} from "../../mongoDB";
import {Sort} from "mongodb";


export const commentRepository = {

    async getCommentByFilter(filter: { id: string }): Promise<CommentResponseFromDBType | null> {
        return commentCollections.findOne(filter)
    },

    async getPostComments(filter:any,  sort: Sort, skip: number, limit: number):Promise<CommentResponseFromDBType[]>{
        return commentCollections.find(filter).sort(sort).skip(skip).limit(limit).toArray()
    },

    async getTotalCount(filter:any){
        return commentCollections.countDocuments(filter)
    },

    async createdComment(newComment: CommentResponseFromDBType):Promise<void>{
        await commentCollections.insertOne(newComment)
    },

    async changeComment(filter: { id: string }, updateComment: { $set: CommentResponseType }):Promise<boolean> {
        const result = await commentCollections.updateOne(filter, updateComment)
        return result.matchedCount === 1
    },

    async deleteComment(filter: { id: string }):Promise<boolean> {
        const result = await commentCollections.deleteOne(filter)
        return result.deletedCount === 1
    },

    async deleteAllComment(){
        await commentCollections.deleteMany({})
    }
}