import {PostResponseType} from "../types/types";
import {postCollections} from "../../mongoDB";
import {Sort} from "mongodb";

export const postRepository = {

    async getAllPosts(filter: any, sort: Sort, skip: number, limit: number): Promise<PostResponseType[]> {
        return postCollections.find(filter).sort(sort).skip(skip).limit(limit).toArray()
    },

    getPostByFilter(id: { id: string }): Promise<PostResponseType | null> {
        return postCollections.findOne(id)
    },

    async getTotalCount(filter: any): Promise<number> {
        return await postCollections.countDocuments(filter)
    },

    async getAllBlogPosts(filter: any, sort: Sort, skip: number, limit: number): Promise<PostResponseType[]> {
        return await postCollections.find(filter).sort(sort).skip(skip).limit(limit).toArray()
    },

    async createPost(newPost: PostResponseType): Promise<void> {
        await postCollections.insertOne(newPost)
    },

    async changePost(id: { id: string }, update: { $set: PostResponseType }): Promise<boolean> {
        const result = await postCollections.updateOne(id, update)
        return (result.matchedCount === 1);

    },

    async deletePost(filter: any): Promise<boolean> {
        const result = await postCollections.deleteOne(filter)
        return result.deletedCount === 1

    },

    async deleteAllPosts(): Promise<void> {
        await postCollections.deleteMany({})
    }
}